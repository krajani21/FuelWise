// Mapping between user fuel type preferences and Google Places API fuel types
const FUEL_TYPE_MAPPING = {
  'Regular': 'REGULAR_UNLEADED',
  'Premium': 'PREMIUM', 
  'Diesel': 'DIESEL'
};

// Fallback order for fuel types when preferred type is not available
const FUEL_TYPE_FALLBACK_ORDER = {
  'Regular': ['REGULAR_UNLEADED', 'MIDGRADE', 'PREMIUM'],
  'Premium': ['PREMIUM', 'REGULAR_UNLEADED', 'MIDGRADE'],
  'Diesel': ['DIESEL', 'DIESEL_PLUS', 'TRUCK_DIESEL']
};

/**
 * Get the Google Places API fuel type for a user's fuel preference
 * @param {string} userFuelType - User's fuel type preference ('Regular', 'Premium', 'Diesel')
 * @returns {string} - Google Places API fuel type
 */
const getUserFuelType = (userFuelType) => {
  return FUEL_TYPE_MAPPING[userFuelType] || 'REGULAR_UNLEADED';
};

/**
 * Get fallback fuel types for a user's fuel preference
 * @param {string} userFuelType - User's fuel type preference
 * @returns {string[]} - Array of fallback fuel types in order of preference
 */
const getFuelTypeFallbacks = (userFuelType) => {
  return FUEL_TYPE_FALLBACK_ORDER[userFuelType] || ['REGULAR_UNLEADED'];
};

/**
 * Find the best available fuel price from a station's fuel options
 * @param {Array} fuelPrices - Array of fuel price objects from Google Places API
 * @param {string} userFuelType - User's preferred fuel type
 * @returns {Object|null} - Best available fuel price object or null if none found
 */
const findBestFuelPrice = (fuelPrices, userFuelType) => {
  if (!fuelPrices || !Array.isArray(fuelPrices)) {
    return null;
  }

  const fallbackTypes = getFuelTypeFallbacks(userFuelType);
  
  // Try each fallback type in order of preference
  for (const fuelType of fallbackTypes) {
    const fuelEntry = fuelPrices.find(fp => fp.type === fuelType);
    if (fuelEntry && fuelEntry.price?.units != null && fuelEntry.price?.nanos != null) {
      return fuelEntry;
    }
  }
  
  return null;
};

/**
 * Convert Google Places API price to float
 * @param {Object} price - Google Places API price object with units and nanos
 * @returns {number} - Price as float
 */
const convertPriceToFloat = (price) => {
  if (!price || price.units == null || price.nanos == null) {
    return null;
  }
  
  return parseFloat(
    `${price.units}.${Math.round(price.nanos / 1e6).toString().padStart(3, '0')}`
  );
};

module.exports = {
  getUserFuelType,
  getFuelTypeFallbacks,
  findBestFuelPrice,
  convertPriceToFloat
};
