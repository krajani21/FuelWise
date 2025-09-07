// Utility functions for handling preferred gas station sorting

/**
 * Check if a station belongs to a preferred brand
 * @param {Object} station - The gas station object
 * @param {Array} preferredBrands - Array of preferred brand names
 * @returns {boolean} - Whether the station is from a preferred brand
 */
export const isPreferredStation = (station, preferredBrands) => {
  if (!station || !preferredBrands || preferredBrands.length === 0) {
    return false;
  }
  
  // Try to get brand from station.brand first, then fall back to extracting from station_name
  let stationBrand = station.brand;
  
  if (!stationBrand || stationBrand === 'undefined') {
    // Extract brand from station name (e.g., "Petro-Canada & Car Wash" -> "Petro-Canada")
    stationBrand = station.station_name;
    
    // Handle common variations
    if (stationBrand.includes('Petro-Canada')) {
      stationBrand = 'Petro-Canada';
    } else if (stationBrand.includes('Shell')) {
      stationBrand = 'Shell';
    } else if (stationBrand.includes('Esso')) {
      stationBrand = 'Esso';
    } else if (stationBrand.includes('Chevron')) {
      stationBrand = 'Chevron';
    } else if (stationBrand.includes('HUSKY')) {
      stationBrand = 'HUSKY';
    } else if (stationBrand.includes('Hughes')) {
      stationBrand = 'Hughes';
    } else if (stationBrand.includes('Domo')) {
      stationBrand = 'Domo';
    }
  }
  
  if (!stationBrand) {
    return false;
  }
  
  // Case-insensitive brand matching
  const stationBrandLower = stationBrand.toLowerCase().trim();
  const isPreferred = preferredBrands.some(preferredBrand => 
    preferredBrand.toLowerCase().trim() === stationBrandLower
  );
  
  return isPreferred;
};

/**
 * Smart sorting function that prioritizes preferred brands in tie situations
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {Function} primarySort - Primary sorting function (distance, savings, etc.)
 * @param {number} tolerance - Tolerance for considering values as "tied" (default: 0.01)
 * @returns {Array} - Sorted array with preferred brands prioritized in ties
 */
export const sortWithPreferredBrands = (stations, preferredBrands, primarySort, tolerance = 0.01) => {
  if (!stations || stations.length === 0) return [];
  if (!preferredBrands || preferredBrands.length === 0) {
    // No preferred brands, use standard sorting
    return [...stations].sort(primarySort);
  }

  return [...stations].sort((a, b) => {
    // First, apply the primary sorting logic
    const primaryResult = primarySort(a, b);
    
    // If the primary values are significantly different, use primary result
    if (Math.abs(primaryResult) > tolerance) {
      return primaryResult;
    }
    
    // Values are tied (within tolerance), check preferred brands
    const aIsPreferred = isPreferredStation(a, preferredBrands);
    const bIsPreferred = isPreferredStation(b, preferredBrands);
    
    // If only one is preferred, prefer it
    if (aIsPreferred && !bIsPreferred) return -1;
    if (!aIsPreferred && bIsPreferred) return 1;
    
    // Both preferred or both not preferred, keep primary sort result
    return primaryResult;
  });
};

/**
 * Sort stations by distance with preferred brand prioritization
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {number} distanceTolerance - Distance tolerance in km for considering stations as tied (default: 0.1)
 * @returns {Array} - Sorted array
 */
export const sortByDistanceWithPreferred = (stations, preferredBrands, distanceTolerance = 0.1) => {
  const primarySort = (a, b) => a.distance - b.distance;
  return sortWithPreferredBrands(stations, preferredBrands, primarySort, distanceTolerance);
};

/**
 * Sort stations by savings with preferred brand prioritization
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {number} savingsTolerance - Savings tolerance in dollars for considering stations as tied (default: 0.50)
 * @returns {Array} - Sorted array
 */
export const sortBySavingsWithPreferred = (stations, preferredBrands, savingsTolerance = 0.50) => {
  // Use trueSavings (net benefit after travel costs) if available, otherwise fall back to old savings
  const primarySort = (a, b) => {
    const aSavings = a.trueSavings !== undefined ? a.trueSavings : (a.savings || 0);
    const bSavings = b.trueSavings !== undefined ? b.trueSavings : (b.savings || 0);
    return bSavings - aSavings;
  };
  return sortWithPreferredBrands(stations, preferredBrands, primarySort, savingsTolerance);
};

/**
 * Sort stations by net savings with smart tie-breaking:
 * 1. Primary sort by trueSavings (net benefit after travel costs)
 * 2. For stations within 1 cent of each other, prefer preferred brands
 * 3. If still tied, prefer closer distance
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {number} costTolerance - Cost tolerance for considering stations as tied (default: 0.10 = 10 cents)
 * @param {number} distanceTolerance - Distance tolerance for considering stations as tied (default: 0.1 km)
 * @returns {Array} - Sorted array
 */
export const sortByNetSavingsWithSmartTieBreaking = (stations, preferredBrands, costTolerance = 0.01, distanceTolerance = 0.1) => {
  return [...stations].sort((a, b) => {
    // Primary sort by true savings (net benefit after travel costs) - HIGHEST FIRST
    const aSavings = a.trueSavings !== undefined ? a.trueSavings : (a.savings || 0);
    const bSavings = b.trueSavings !== undefined ? b.trueSavings : (b.savings || 0);
    
    // First priority: sort by net savings (highest first)
    const savingsDiff = bSavings - aSavings;
    
    // If savings are significantly different, use that
    if (Math.abs(savingsDiff) > costTolerance) {
      return savingsDiff;
    }
    
    // Savings are within tolerance (tied), check preferred brands
    if (preferredBrands && preferredBrands.length > 0) {
      const aIsPreferred = isPreferredStation(a, preferredBrands);
      const bIsPreferred = isPreferredStation(b, preferredBrands);
      
      if (aIsPreferred && !bIsPreferred) {
        return -1;
      }
      if (!aIsPreferred && bIsPreferred) {
        return 1;
      }
    }
    
    // Still tied (both preferred or both not), sort by distance (closest first)
    const distanceDiff = a.distance - b.distance;
    
    // If distances are significantly different, use that
    if (Math.abs(distanceDiff) > distanceTolerance * 1000) {
      return distanceDiff;
    }
    
    // Everything is tied, maintain original order
    return 0;
  });
};

/**
 * Sort stations by volume with preferred brand prioritization
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {number} volumeTolerance - Volume tolerance in liters for considering stations as tied (default: 1.0)
 * @returns {Array} - Sorted array
 */
export const sortByVolumeWithPreferred = (stations, preferredBrands, volumeTolerance = 1.0) => {
  const primarySort = (a, b) => b.fuel_volume - a.fuel_volume;
  return sortWithPreferredBrands(stations, preferredBrands, primarySort, volumeTolerance);
};

/**
 * Sort stations by combined savings and distance with preferred brand prioritization
 * @param {Array} stations - Array of station objects
 * @param {Array} preferredBrands - Array of preferred brand names
 * @param {number} savingsTolerance - Savings tolerance for ties (default: 0.50)
 * @param {number} distanceTolerance - Distance tolerance for ties (default: 0.1)
 * @returns {Array} - Sorted array
 */
export const sortBySavingsAndDistanceWithPreferred = (stations, preferredBrands, savingsTolerance = 0.01, distanceTolerance = 0.1) => {
  return [...stations].sort((a, b) => {
    // Primary sort by true savings (net benefit after travel costs)
    const aSavings = a.trueSavings !== undefined ? a.trueSavings : (a.savings || 0);
    const bSavings = b.trueSavings !== undefined ? b.trueSavings : (b.savings || 0);
    const savingsDiff = bSavings - aSavings;
    
    // If savings are significantly different, use that
    if (Math.abs(savingsDiff) > savingsTolerance) {
      return savingsDiff;
    }
    
    // Savings are tied, check preferred brands for savings tie-breaker
    if (preferredBrands && preferredBrands.length > 0) {
      const aIsPreferred = isPreferredStation(a, preferredBrands);
      const bIsPreferred = isPreferredStation(b, preferredBrands);
      
      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;
    }
    
    // Savings tied (and both preferred or both not), sort by distance
    const distanceDiff = a.distance - b.distance;
    
    // If distances are significantly different, use that
    if (Math.abs(distanceDiff) > distanceTolerance) {
      return distanceDiff;
    }
    
    // Both savings and distance are tied, prefer preferred brands again
    if (preferredBrands && preferredBrands.length > 0) {
      const aIsPreferred = isPreferredStation(a, preferredBrands);
      const bIsPreferred = isPreferredStation(b, preferredBrands);
      
      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;
    }
    
    // Everything is tied, maintain original order
    return distanceDiff;
  });
};
