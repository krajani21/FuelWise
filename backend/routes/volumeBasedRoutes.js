const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateEffectiveFuelVolume } = require("../utils/calculate");
const { findBestFuelPrice, convertPriceToFloat } = require("../utils/fuelTypeMapping");
const { normalizeSearchParams, generateCacheKey } = require("../utils/normalizeQuery");
const { recordApiCall, recordNormalizedRequest } = require("../utils/metrics");
const { collapseRequest } = require("../utils/requestCollapsing");
const cache = require("../utils/cache");
const { optionalAuth, searchRateLimiter } = require("../middleware/rateLimiter");

// Helper function to chunk array into smaller arrays
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

router.post("/", optionalAuth, searchRateLimiter, async (req, res) => {
  try {
    // Normalize query parameters
    const normalized = normalizeSearchParams(req.body);
    const { origin, budget, efficiency, radius, fuelType } = normalized;

    if (
      !origin || !origin.lat || !origin.lng ||
      typeof budget !== "number" ||
      typeof efficiency !== "number"
    ) {
      return res.status(400).json({ error: "Invalid origin, budget, or efficiency" });
    }
    
    // Record metrics
    recordApiCall('volume');
    const cacheKey = generateCacheKey(normalized);
    recordNormalizedRequest(cacheKey);
    
    // Log normalization for verification
    console.log("\n=== VOLUME-BASED SEARCH ===");
    console.log("📍 Original coords:", req.body.origin.lat.toFixed(6), req.body.origin.lng.toFixed(6));
    console.log("📍 Normalized coords:", origin.lat.toFixed(3), origin.lng.toFixed(3));
    console.log("📏 Original radius:", req.body.radius, "km → Bucketed:", radius, "km");
    console.log("💵 Budget/Efficiency:", req.body.budget.toFixed(2), "/", req.body.efficiency.toFixed(2), "→", budget.toFixed(2), "/", efficiency.toFixed(1));
    console.log("🔑 Cache Key:", cacheKey);
    console.log("===========================\n");

    // Check cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Collapse identical concurrent requests
    const finalStations = await collapseRequest(cacheKey, async () => {
      // All API logic goes here - wrapped to prevent duplicate concurrent calls
      const radiusInMeters = radius * 1000;
    const originString = `${origin.lat},${origin.lng}`;
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${originString}&radius=${radiusInMeters}&type=gas_station&key=${process.env.GOOGLE_API_KEY}`;
    
      const nearbyResponse = await axios.get(nearbyUrl);
      
      if (!nearbyResponse.data || !nearbyResponse.data.results) {
        console.error("Places API error:", nearbyResponse.data);
        throw new Error("Failed to fetch nearby stations");
      }
      
      let nearbyStations = nearbyResponse.data.results;
      
      // If we have a next_page_token and want more results (for larger radius), fetch additional pages
      if (nearbyResponse.data.next_page_token && radius > 5) {
        // Wait a bit before making the next request (Google requires a short delay)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const nextPageUrl = `${nearbyUrl}&pagetoken=${nearbyResponse.data.next_page_token}`;
          const nextPageResponse = await axios.get(nextPageUrl);
          
          if (nextPageResponse.data && nextPageResponse.data.results) {
            nearbyStations = [...nearbyStations, ...nextPageResponse.data.results];
          }
        } catch (error) {
          console.log("Error fetching next page:", error.message);
        }
      }

      const placeDetailsPromises = nearbyStations.map(async (station) => {
        try {
          const detailsUrl = `https://places.googleapis.com/v1/places/${station.place_id}?fields=displayName,formattedAddress,fuelOptions&key=${process.env.GOOGLE_API_KEY}`;
          const detailsRes = await axios.get(detailsUrl);
          const details = detailsRes.data;

          const prices = details?.fuelOptions?.fuelPrices;
          const fuelEntry = findBestFuelPrice(prices, fuelType);

          if (!fuelEntry) {
            return null;
          }

          const priceFloat = convertPriceToFloat(fuelEntry.price);

          return {
            place_id: station.place_id,
            station_name: details.displayName?.text || station.name,
            address: details.formattedAddress || station.vicinity,
            location: station.geometry.location,
            lat: station.geometry.location.lat,
            lng: station.geometry.location.lng, 
            price: priceFloat,
          };
        } catch (error) {
          return null;
        }
      });

      const stationResults = (await Promise.all(placeDetailsPromises)).filter(Boolean);

      // Check if we have stations before calling distance matrix
      if (stationResults.length === 0) {
        return [];
      }

      // Handle Distance Matrix API with batching for large numbers of destinations
      let allDistanceData = [];
      
      if (stationResults.length > 25) {
        // Split destinations into chunks of 25 (Google's limit)
        const destinationChunks = chunkArray(stationResults, 25);
        
        // Make separate API calls for each chunk
        for (let i = 0; i < destinationChunks.length; i++) {
          const chunk = destinationChunks[i];
          const destinations = chunk.map(s => `${s.location.lat},${s.location.lng}`).join("|");
          const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;
          
          try {
            const distanceRes = await axios.get(distanceUrl);
            
            if (distanceRes.data && distanceRes.data.rows && distanceRes.data.rows.length > 0) {
              const chunkDistanceData = distanceRes.data.rows[0].elements;
              if (chunkDistanceData && Array.isArray(chunkDistanceData)) {
                allDistanceData = [...allDistanceData, ...chunkDistanceData];
              }
            }
            
            // Add a small delay between API calls to avoid rate limiting
            if (i < destinationChunks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error(`Error fetching distance data for chunk ${i}:`, error.message);
            // Add null elements for failed chunks
            const nullElements = new Array(chunk.length).fill(null);
            allDistanceData = [...allDistanceData, ...nullElements];
          }
        }
      } else {
        // Single API call for smaller numbers of destinations
        const destinations = stationResults.map(s => `${s.location.lat},${s.location.lng}`).join("|");
        const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;
        
        try {
          const distanceRes = await axios.get(distanceUrl);
          
          if (distanceRes.data && distanceRes.data.rows && distanceRes.data.rows.length > 0) {
            allDistanceData = distanceRes.data.rows[0].elements || [];
          }
        } catch (error) {
          console.error('Error in single Distance Matrix API call:', error.message);
        }
      }
      
      // Add error handling for distance matrix response
      if (!allDistanceData || allDistanceData.length === 0) {
        console.error("Distance Matrix API error: No distance data received");
        // Return stations without distance data
        const fallbackStations = stationResults.map(station => {
          const result = calculateEffectiveFuelVolume({
            price_per_litre: station.price,
            distance_km: 0, // fallback distance
            budget,
            efficiency_l_per_100km: efficiency
          });
          return {
            ...station,
            distance: null,
            distance_text: "Distance unavailable",
            duration_text: "Duration unavailable",
            fuel_volume: parseFloat(result.fuel_volume),
          };
        });
        return fallbackStations;
      }

      // Ensure we have the right number of distance elements
      if (allDistanceData.length !== stationResults.length) {
        console.warn(`Distance data mismatch: expected ${stationResults.length}, got ${allDistanceData.length}`);
        // Pad with nulls if we're short
        while (allDistanceData.length < stationResults.length) {
          allDistanceData.push(null);
        }
      }

      return stationResults.map((station, i) => {
        const distanceElement = allDistanceData[i];
        const distance_km = distanceElement?.distance?.value ? distanceElement.distance.value / 1000 : 0;
        const duration_text = distanceElement?.duration?.text || "Duration unavailable";
        const distance_text = distanceElement?.distance?.text || "Distance unavailable";

        const result = calculateEffectiveFuelVolume({
          price_per_litre: station.price,
          distance_km,
          budget,
          efficiency_l_per_100km: efficiency
        });

        return {
          ...station,
          distance: distanceElement?.distance?.value || null,
          distance_text,
          duration_text,
          fuel_volume: parseFloat(result.fuel_volume),
        };
      });
    }); // End of collapseRequest

    // Cache the result (15 minutes TTL)
    cache.set(cacheKey, finalStations, 900);

    res.json(finalStations);
  } catch (err) {
    console.error("Error in /api/volume-based:", err.message);
    res.status(500).json({ error: "Failed to calculate volume-based data" });
  }
});

module.exports = router;
