import React, { useState, useEffect } from 'react';
import { fetchVolumeBased } from '../api/volumeBased';
import { calculateDollarSavings, calculateAreaStatistics } from '../utils/savings';
import { sortByDistanceWithPreferred, sortByVolumeWithPreferred, sortBySavingsAndDistanceWithPreferred, sortByNetSavingsWithSmartTieBreaking, isPreferredStation } from '../utils/preferredStations';
import { usePreferredBrands } from '../hooks/usePreferredBrands';
import { MapPin, Navigation, DollarSign, Fuel, RefreshCw, Star, Map, List } from 'lucide-react';
import AreaStatistics from '../components/AreaStatistics';
import MapsView from '../components/MapsView';
import { useNavigate } from 'react-router-dom';

const FuelListVolume = ({ userLocation }) => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [fuelAmount, setFuelAmount] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [radius, setRadius] = useState("5"); // Default to 5km
  const [submittedAmount, setSubmittedAmount] = useState(null);
  const [submittedEfficiency, setSubmittedEfficiency] = useState(null);
  const [sortMode, setSortMode] = useState("volume"); // "volume", "distance", "both", "savings"
  const [areaStats, setAreaStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userFuelType, setUserFuelType] = useState('Regular'); // Default fuel type
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const { preferredBrands, loading: brandsLoading } = usePreferredBrands();

  // Get URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const eff = urlParams.get('efficiency');
    const sort = urlParams.get('sort');
    const radius = urlParams.get('radius') || '5'; // Default to 5km if not provided
    const fuelTypeParam = urlParams.get('fuelType') || 'Regular'; // Default to Regular if not provided
    
    if (amount && eff) {
      setFuelAmount(amount);
      setEfficiency(eff);
      setSubmittedAmount(parseFloat(amount));
      setSubmittedEfficiency(parseFloat(eff));
    }
    
    if (radius) {
      console.log("Setting radius from URL:", radius, "km");
      setRadius(radius);
    }
    
    if (sort) {
      setSortMode(sort);
    }

    // Set fuel type from URL or default to Regular
    if (['Regular', 'Premium', 'Diesel'].includes(fuelTypeParam)) {
      setUserFuelType(fuelTypeParam);
    }
  }, []);

  useEffect(() => {
    if (userLocation && submittedAmount !== null && submittedEfficiency !== null && !brandsLoading) {
      setIsLoading(true);
      setStations([]); // Clear previous results when starting new search
      setAreaStats(null); // Clear previous area stats
      console.log("Fetching volume-based data with radius:", radius, "km");
      fetchVolumeBased(userLocation, submittedAmount, submittedEfficiency, radius, userFuelType)
        .then((data) => {
          const filtered = data.filter(station => station.fuel_volume !== null);
          
          // Check if we have any valid stations
          if (filtered.length === 0) {
            setStations([]);
            setAreaStats(null);
            setIsLoading(false);
            console.log("No stations found with valid fuel volume data");
            return;
          }
          
          const nearest = filtered.reduce((a, b) => a.distance < b.distance ? a : b);

          // Calculate TRUE savings for all stations (net benefit after travel costs)
          const withSavings = filtered.map((station) => {
            // CORRECT calculation logic as specified by user:
            // 1. Calculate travel cost to nearest station using nearest station's price
            // 2. Calculate effective fuel volume at nearest station
            // 3. Calculate travel cost to current station using current station's price  
            // 4. Calculate effective fuel volume at current station
            // 5. Calculate difference and convert using nearest station's price
            
            // Convert distances from meters to kilometers
            const nearestDistanceKm = nearest.distance / 1000;
            const stationDistanceKm = station.distance / 1000;
            
            // Step 1 & 2: Nearest station (reference) calculation
            const nearestTravelCost = (nearestDistanceKm * 2 * submittedEfficiency / 100) * nearest.price; // round trip
            const nearestRemainingBudget = submittedAmount - nearestTravelCost;
            const nearestEffectiveVolume = nearestRemainingBudget / nearest.price;
            
            // Step 3 & 4: Current station calculation
            const stationTravelCost = (stationDistanceKm * 2 * submittedEfficiency / 100) * station.price; // round trip
            const stationRemainingBudget = submittedAmount - stationTravelCost;
            const stationEffectiveVolume = stationRemainingBudget / station.price;
            
            // Step 5: Net benefit calculation
            const trueSavingsLitres = stationEffectiveVolume - nearestEffectiveVolume;
            const trueSavingsDollars = trueSavingsLitres * nearest.price; // Use nearest station's price for conversion
            
            // Also keep the old savings calculation for display compatibility
            const displaySavings = calculateDollarSavings(nearest.price, station.price, stationEffectiveVolume);
            const isReference = station.address === nearest.address;
            
            const result = { 
              ...station, 
              fuel_volume: stationEffectiveVolume, // Use the correctly calculated volume
              savings: displaySavings, // for display
              trueSavings: trueSavingsDollars, // for sorting (can be negative)
              trueSavingsLitres: trueSavingsLitres, // for display (can be negative)
              isReference 
            };
            
            
            return result;
          });

          // Sort based on mode with preferred brand prioritization
          let sorted;
          if (sortMode === "distance") {
            sorted = sortByDistanceWithPreferred(withSavings, preferredBrands);
          } else if (sortMode === "both") {
            // Primary sort by savings, secondary by distance, with preferred brand tie-breaking
            sorted = sortBySavingsAndDistanceWithPreferred(withSavings, preferredBrands);
          } else if (sortMode === "savings") {
            // Sort by net savings with smart tie-breaking (1 cent tolerance, then preferred brands, then distance)
            sorted = sortByNetSavingsWithSmartTieBreaking(withSavings, preferredBrands, 0.01, 0.1);
            

          } else {
            // Default: sort by volume (max fuel you can get) with preferred brand tie-breaking
            sorted = sortByVolumeWithPreferred(withSavings, preferredBrands);
          }

          setStations(sorted);
          
          // Calculate and set area statistics
          const stats = calculateAreaStatistics(filtered);
          setAreaStats(stats);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch volume-based data:", err);
          setIsLoading(false);
        });
    }
  }, [userLocation, submittedAmount, submittedEfficiency, sortMode, preferredBrands, brandsLoading, radius, userFuelType]);

  const handleSubmit = () => {
    setIsLoading(true);
    setStations([]); // Clear previous results immediately
    setAreaStats(null); // Clear previous area stats immediately
    setSubmittedAmount(parseFloat(fuelAmount));
    setSubmittedEfficiency(parseFloat(efficiency));
  };

  const handleGetDirections = (lat, lng) => {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleRefreshSearch = () => {
    // Navigate back to home with current search parameters
    const params = new URLSearchParams({
      amount: submittedAmount?.toString() || '',
      efficiency: submittedEfficiency?.toString() || '',
      radius: radius || '5',
      fuelType: userFuelType || 'Regular'
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-6 flex items-center">
          <Fuel className="h-8 w-8 mr-3 text-[#4CAF50]" />
          <div>
            {sortMode === "distance" ? "Fuel Stations by Distance" :
             sortMode === "both" ? "Fuel Stations by Savings & Distance" :
             sortMode === "savings" ? "Fuel Stations by Net Savings (After Travel Costs)" :
             "Fuel Stations by Max Volume (Budget-based)"}
            {parseInt(radius) > 5 && (
              <div className="text-lg text-blue-600 font-normal mt-1">
                Search Radius: {radius}km
              </div>
            )}
          </div>
        </h1>

        {/* View Toggle Buttons */}
        {submittedAmount !== null && submittedEfficiency !== null && stations.length > 0 && (
          <div className="flex justify-end mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-[#4CAF50] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-white text-[#4CAF50] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Map className="h-4 w-4 mr-2" />
                Map View
              </button>
            </div>
          </div>
        )}

        {preferredBrands && preferredBrands.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                <strong>Preferred brands prioritized:</strong> When stations have similar {
                  sortMode === "distance" ? "distances" :
                  sortMode === "both" ? "savings or distances" :
                  sortMode === "savings" ? "net savings amounts" :
                  "fuel volumes"
                }, your preferred brands ({preferredBrands.join(', ')}) will be shown first.
              </p>
            </div>
          </div>
        )}



        {submittedAmount !== null && submittedEfficiency !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-green-800 text-sm">
                  <strong>Search Parameters:</strong> ${submittedAmount} budget, {submittedEfficiency} L/100km efficiency, {radius}km radius
                  {parseInt(radius) > 5 && (
                    <span className="ml-2 text-blue-600 font-medium">
                      (Expanded from 5km)
                    </span>
                  )}
                </p>
              </div>
              <button 
                onClick={handleRefreshSearch}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Modify</span>
              </button>
            </div>
          </div>
        )}

        <AreaStatistics statistics={areaStats} />

        {/* Radius Expansion Suggestion for No Positive Net Benefits */}
        {!isLoading && stations.length > 0 && submittedAmount !== null && submittedEfficiency !== null && sortMode === "savings" && !stations.some(s => (s.trueSavings || 0) > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">🔍</span>
                </div>
                <div>
                  <h3 className="text-blue-800 font-semibold text-sm mb-1">
                    No Positive Net Benefits Found
                  </h3>
                  <p className="text-blue-600 text-xs">
                    Try expanding your search radius to find better deals
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {parseInt(radius) < 10 && (
                  <button
                    onClick={() => {
                      const newRadius = Math.min(parseInt(radius) * 2, 10);
                      setRadius(newRadius.toString());
                      // Trigger a new search with the expanded radius
                      if (userLocation) {
                        setIsLoading(true);
                        setStations([]);
                        setAreaStats(null);
                        // The useEffect will automatically trigger with the new radius
                      }
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Try {Math.min(parseInt(radius) * 2, 10)}km
                  </button>
                )}
                {parseInt(radius) < 50 && (
                  <button
                    onClick={() => {
                      setRadius("50");
                      // Trigger a new search with the maximum radius
                      if (userLocation) {
                        setIsLoading(true);
                        setStations([]);
                        setAreaStats(null);
                        // The useEffect will automatically trigger with the new radius
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Try 50km (Max)
                  </button>
                )}
                {parseInt(radius) >= 50 && (
                  <span className="text-blue-600 text-xs px-3 py-2">
                    Maximum radius reached
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Message when Positive Net Benefits Found After Radius Expansion */}
        {!isLoading && stations.length > 0 && submittedAmount !== null && submittedEfficiency !== null && sortMode === "savings" && stations.some(s => (s.trueSavings || 0) > 0) && parseInt(radius) > 5 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                <span className="text-sm font-bold">✅</span>
              </div>
              <div>
                <h3 className="text-green-800 font-semibold text-sm mb-1">
                  Better Deals Found!
                </h3>
                <p className="text-green-600 text-xs">
                  Expanding to {radius}km radius found {stations.filter(s => (s.trueSavings || 0) > 0).length} stations with positive net benefits
                </p>
              </div>
            </div>
          </div>
        )}

        {userLocation && submittedAmount === null && submittedEfficiency === null && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Amount:
              </label>
              <input
                type="number"
                value={fuelAmount}
                onChange={(e) => setFuelAmount(e.target.value)}
                placeholder="e.g. 40"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                <Fuel className="inline h-4 w-4 mr-1" />
                Efficiency (L/100km):
              </label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                placeholder="e.g. 8.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleSubmit}
                className="w-full bg-[#4CAF50] hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Conditional rendering based on view mode */}
        {viewMode === 'map' ? (
          <MapsView
            userLocation={userLocation}
            stations={stations}
            submittedAmount={submittedAmount}
            submittedEfficiency={submittedEfficiency}
            preferredBrands={preferredBrands}
            onStationClick={(station) => {
              // Optional: Handle station click from map
              console.log('Station clicked:', station);
            }}
          />
        ) : (
          <div className="grid gap-4">
            {stations.map((station, index) => (
            <div key={index} className={`bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 ${
              isPreferredStation(station, preferredBrands) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-[#333333]">{station.station_name}</h3>
                    {isPreferredStation(station, preferredBrands) && (
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Preferred
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{station.address}</span>
                  </div>
                  <div className="flex items-center text-lg font-bold text-black mb-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>${station.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-right mb-2">
                    <div className="text-2xl font-bold text-gray-800">{station.duration_text}</div>
                    <div className="text-sm text-gray-600">{(station.distance / 1000).toFixed(1)} km</div>
                  </div>

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleGetDirections(station.lat, station.lng)}
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>

              {/* Hidden calculations for future use */}
              {(() => {
                const distanceKm = (station.distance || 0) / 1000;
                const travelCost = (distanceKm * submittedEfficiency / 100) * station.price;
                const fuelCost = station.fuel_volume * station.price;
                const totalCost = submittedAmount || 0;
                const costPerL = totalCost / station.fuel_volume;
                // Store calculations for potential future use
                station._calculations = { distanceKm, travelCost, fuelCost, totalCost, costPerL };
                return null;
              })()}

              {/* Net Savings Display (True Savings After Travel Costs) */}
              {(() => {
                // Show true net savings: how much more fuel you can get here vs nearest station
                const trueSavings = station.trueSavings || 0;
                const trueSavingsLitres = station.trueSavingsLitres || 0;
                
                // Calculate extra driving range from the extra fuel gained
                const extraKilometers = submittedEfficiency > 0 
                  ? (trueSavingsLitres * 100) / submittedEfficiency 
                  : 0;
                
                // Show any positive savings, but only show negative costs if they're >= 10 cents
                if (trueSavings > 0) {
                  // Always show positive savings
                } else if (trueSavings < -0.10) {
                  // Only show negative costs >= 10 cents
                } else {
                  // Hide small negative costs (< 10 cents)
                  return null;
                }

                const isPositive = trueSavings > 0;
                const bgColor = isPositive ? "from-green-50 to-emerald-50" : "from-red-50 to-pink-50";
                const borderColor = isPositive ? "border-green-200" : "border-red-200";
                const iconBg = isPositive ? "bg-green-500" : "bg-red-500";
                const textColor = isPositive ? "text-green-800" : "text-red-800";
                const subTextColor = isPositive ? "text-green-600" : "text-red-600";
                const badgeColor = isPositive ? "bg-green-500" : "bg-red-500";
                const badgeText = isPositive ? "Worth the Trip!" : "Not Worth It";

                return (
                  <div className="mt-4 border-t pt-4">
                    <div className={`flex items-center justify-between bg-gradient-to-r ${bgColor} border ${borderColor} rounded-lg p-4`}>
                      <div className="flex items-center space-x-3">
                        <div className={`${iconBg} text-white rounded-full w-10 h-10 flex items-center justify-center`}>
                          <span className="text-lg font-bold">⛽</span>
                        </div>
                        <div>
                          <div className={`font-bold ${textColor} text-lg`}>
                            {isPositive ? '+' : ''}${trueSavings.toFixed(2)} Net {isPositive ? 'Benefit' : 'Cost'}
                          </div>
                          <div className={`${subTextColor} text-sm`}>
                            {isPositive ? '+' : ''}{Math.abs(extraKilometers).toFixed(0)} km {isPositive ? 'extra range' : 'less range'} • {isPositive ? '+' : ''}{trueSavingsLitres.toFixed(1)}L {isPositive ? 'more fuel' : 'less fuel'} after travel costs
                          </div>
                        </div>
                      </div>
                                              <div className="flex items-center space-x-2">
                          {sortMode === "savings" && (
                            <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-green-200">
                              #{index + 1}
                            </div>
                          )}
                          <div className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {badgeText}
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })()}



              {station.isReference && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-blue-800 text-sm font-medium">
                    ⭐ Nearest station used for comparison
                  </p>
                </div>
              )}
            </div>
          ))}
          </div>
        )}

        {isLoading && submittedAmount !== null && submittedEfficiency !== null && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for fuel stations...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments for larger search areas</p>
          </div>
        )}

        {!isLoading && stations.length === 0 && submittedAmount !== null && submittedEfficiency !== null && (
          <div className="text-center py-8">
            <p className="text-gray-600">No stations found. Try adjusting your search criteria.</p>
          </div>
        )}


      </div>
    </div>
  );
};

export default FuelListVolume;
