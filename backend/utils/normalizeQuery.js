/**
 * Normalize query parameters to improve cache hit rates and reduce duplicate API calls
 */

/**
 * Snap coordinates to a grid to treat nearby locations as identical
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Grid precision in degrees (default: 0.001 ≈ 110m)
 * @returns {Object} - Normalized coordinates
 */
const snapCoordinatesToGrid = (lat, lng, precision = 0.001) => {
  return {
    lat: Math.round(lat / precision) * precision,
    lng: Math.round(lng / precision) * precision
  };
};

/**
 * Bucket radius values to a fixed set
 * @param {number} radius - Requested radius in km
 * @returns {number} - Bucketed radius
 */
const bucketRadius = (radius) => {
  const radiusBuckets = [5, 10, 20, 50];
  
  // Find closest bucket
  return radiusBuckets.reduce((prev, curr) => {
    return Math.abs(curr - radius) < Math.abs(prev - radius) ? curr : prev;
  });
};

/**
 * Normalize search parameters for volume-based and distance-only queries
 * @param {Object} params - Query parameters
 * @returns {Object} - Normalized parameters
 */
const normalizeSearchParams = (params) => {
  const { origin, radius, budget, efficiency, fuelType } = params;
  
  // Snap coordinates to grid (0.001° ≈ 110m for discovery)
  const normalizedOrigin = snapCoordinatesToGrid(origin.lat, origin.lng, 0.001);
  
  // Bucket radius
  const normalizedRadius = bucketRadius(radius || 5);
  
  // Round budget and efficiency to reasonable precision
  const normalizedBudget = budget ? Math.round(budget * 100) / 100 : null; // 2 decimal places
  const normalizedEfficiency = efficiency ? Math.round(efficiency * 10) / 10 : null; // 1 decimal place
  
  return {
    origin: normalizedOrigin,
    radius: normalizedRadius,
    budget: normalizedBudget,
    efficiency: normalizedEfficiency,
    fuelType: fuelType || 'Regular'
  };
};

/**
 * Generate a cache key from normalized parameters
 * @param {Object} normalizedParams - Normalized parameters
 * @returns {string} - Cache key
 */
const generateCacheKey = (normalizedParams) => {
  const { origin, radius, budget, efficiency, fuelType } = normalizedParams;
  
  // Create deterministic key
  const parts = [
    `lat:${origin.lat}`,
    `lng:${origin.lng}`,
    `r:${radius}`,
    budget !== null ? `b:${budget}` : null,
    efficiency !== null ? `e:${efficiency}` : null,
    `ft:${fuelType}`
  ].filter(Boolean);
  
  return parts.join('|');
};

module.exports = {
  snapCoordinatesToGrid,
  bucketRadius,
  normalizeSearchParams,
  generateCacheKey
};

