// Mapping between user fuel type preferences and Google Places API fuel types
export const FUEL_TYPE_MAPPING = {
  'Regular': 'REGULAR_UNLEADED',
  'Premium': 'PREMIUM', 
  'Diesel': 'DIESEL'
};

// Fallback order for fuel types when preferred type is not available
export const FUEL_TYPE_FALLBACK_ORDER = {
  'Regular': ['REGULAR_UNLEADED', 'MIDGRADE', 'PREMIUM'],
  'Premium': ['PREMIUM', 'REGULAR_UNLEADED', 'MIDGRADE'],
  'Diesel': ['DIESEL', 'DIESEL_PLUS', 'TRUCK_DIESEL']
};

/**
 * Get the Google Places API fuel type for a user's fuel preference
 * @param {string} userFuelType - User's fuel type preference ('Regular', 'Premium', 'Diesel')
 * @returns {string} - Google Places API fuel type
 */
export const getUserFuelType = (userFuelType) => {
  return FUEL_TYPE_MAPPING[userFuelType] || 'REGULAR_UNLEADED';
};

/**
 * Get fallback fuel types for a user's fuel preference
 * @param {string} userFuelType - User's fuel type preference
 * @returns {string[]} - Array of fallback fuel types in order of preference
 */
export const getFuelTypeFallbacks = (userFuelType) => {
  return FUEL_TYPE_FALLBACK_ORDER[userFuelType] || ['REGULAR_UNLEADED'];
};
