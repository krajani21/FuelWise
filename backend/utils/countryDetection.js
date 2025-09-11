/**
 * Country detection utility based on coordinates
 * Uses coordinate boundaries to determine country
 */

/**
 * Detect country from latitude and longitude coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} - Country code (US, CA, etc.)
 */
const detectCountryFromCoordinates = (lat, lng) => {
  // Validate input
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return 'US'; // Default fallback
  }

  // Check if coordinates are valid
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return 'US'; // Default fallback
  }

  // Canada boundaries (check first since it overlaps with US)
  if (lat >= 41.675105 && lat <= 83.110626 && lng >= -141.00187 && lng <= -52.636291) {
    return 'CA';
  }

  // United States boundaries
  if (lat >= 24.396308 && lat <= 49.384358 && lng >= -125.000000 && lng <= -66.934570) {
    return 'US';
  }

  // United Kingdom boundaries
  if (lat >= 49.959999 && lat <= 60.860000 && lng >= -8.180000 && lng <= 1.760000) {
    return 'UK';
  }

  // Australia boundaries
  if (lat >= -43.643611 && lat <= -10.668056 && lng >= 113.338953 && lng <= 153.569469) {
    return 'AU';
  }

  // Germany boundaries
  if (lat >= 47.270111 && lat <= 55.0815 && lng >= 5.866315 && lng <= 15.041932) {
    return 'DE';
  }

  // France boundaries
  if (lat >= 41.325300 && lat <= 51.124200 && lng >= -5.559100 && lng <= 9.662500) {
    return 'FR';
  }

  // Italy boundaries
  if (lat >= 35.492222 && lat <= 47.092146 && lng >= 6.626720 && lng <= 18.797518) {
    return 'IT';
  }

  // Spain boundaries
  if (lat >= 27.433542 && lat <= 43.791356 && lng >= -18.393685 && lng <= 4.591888) {
    return 'ES';
  }

  // Netherlands boundaries
  if (lat >= 50.750384 && lat <= 53.675564 && lng >= 3.331601 && lng <= 7.227498) {
    return 'NL';
  }

  // Belgium boundaries
  if (lat >= 49.496982 && lat <= 51.550080 && lng >= 2.546544 && lng <= 6.407861) {
    return 'BE';
  }

  // Switzerland boundaries
  if (lat >= 45.817920 && lat <= 47.808453 && lng >= 5.955911 && lng <= 10.492294) {
    return 'CH';
  }

  // Austria boundaries
  if (lat >= 46.372276 && lat <= 49.020528 && lng >= 9.530749 && lng <= 17.160776) {
    return 'AT';
  }

  // Sweden boundaries
  if (lat >= 55.361737 && lat <= 69.059970 && lng >= 11.027369 && lng <= 24.177310) {
    return 'SE';
  }

  // Norway boundaries
  if (lat >= 57.977917 && lat <= 80.657144 && lng >= 4.650167 && lng <= 31.293418) {
    return 'NO';
  }

  // Denmark boundaries
  if (lat >= 54.559417 && lat <= 57.748417 && lng >= 8.075611 && lng <= 15.158833) {
    return 'DK';
  }

  // Finland boundaries
  if (lat >= 59.808361 && lat <= 70.092293 && lng >= 20.556292 && lng <= 31.586707) {
    return 'FI';
  }

  // Poland boundaries
  if (lat >= 49.002046 && lat <= 54.835827 && lng >= 14.122970 && lng <= 24.145783) {
    return 'PL';
  }

  // Czech Republic boundaries
  if (lat >= 48.551808 && lat <= 51.055703 && lng >= 12.096194 && lng <= 18.858170) {
    return 'CZ';
  }

  // Hungary boundaries
  if (lat >= 45.737128 && lat <= 48.585257 && lng >= 16.113886 && lng <= 22.906765) {
    return 'HU';
  }

  // Slovakia boundaries
  if (lat >= 47.758429 && lat <= 49.613817 && lng >= 16.879983 && lng <= 22.558137) {
    return 'SK';
  }

  // Slovenia boundaries
  if (lat >= 45.421425 && lat <= 46.876681 && lng >= 13.375469 && lng <= 16.610632) {
    return 'SI';
  }

  // Croatia boundaries
  if (lat >= 42.479991 && lat <= 46.503750 && lng >= 13.506481 && lng <= 19.390475) {
    return 'HR';
  }

  // Bulgaria boundaries
  if (lat >= 41.235393 && lat <= 44.216706 && lng >= 22.357145 && lng <= 28.612167) {
    return 'BG';
  }

  // Romania boundaries
  if (lat >= 43.688445 && lat <= 48.220881 && lng >= 20.220192 && lng <= 29.715055) {
    return 'RO';
  }

  // Lithuania boundaries
  if (lat >= 53.896702 && lat <= 56.372528 && lng >= 20.934256 && lng <= 26.835519) {
    return 'LT';
  }

  // Latvia boundaries
  if (lat >= 55.674650 && lat <= 58.085569 && lng >= 20.674129 && lng <= 28.241490) {
    return 'LV';
  }

  // Estonia boundaries
  if (lat >= 57.474528 && lat <= 59.611090 && lng >= 21.837584 && lng <= 28.210017) {
    return 'EE';
  }

  // Ireland boundaries
  if (lat >= 51.416667 && lat <= 55.416667 && lng >= -10.480000 && lng <= -5.991667) {
    return 'IE';
  }

  // Portugal boundaries
  if (lat >= 36.838261 && lat <= 42.280468 && lng >= -9.526540 && lng <= -6.189159) {
    return 'PT';
  }

  // Greece boundaries
  if (lat >= 34.802075 && lat <= 41.748886 && lng >= 19.373603 && lng <= 29.729698) {
    return 'GR';
  }

  // Cyprus boundaries
  if (lat >= 34.571869 && lat <= 35.173125 && lng >= 32.256667 && lng <= 34.597916) {
    return 'CY';
  }

  // Malta boundaries
  if (lat >= 35.783333 && lat <= 36.083333 && lng >= 14.183333 && lng <= 14.566667) {
    return 'MT';
  }

  // Luxembourg boundaries
  if (lat >= 49.442667 && lat <= 50.182944 && lng >= 5.674051 && lng <= 6.530748) {
    return 'LU';
  }

  // Iceland boundaries
  if (lat >= 63.391521 && lat <= 66.526792 && lng >= -24.326524 && lng <= -13.609732) {
    return 'IS';
  }

  // Liechtenstein boundaries
  if (lat >= 47.048429 && lat <= 47.270611 && lng >= 9.471808 && lng <= 9.635571) {
    return 'LI';
  }

  // Monaco boundaries
  if (lat >= 43.724759 && lat <= 43.751931 && lng >= 7.409027 && lng <= 7.439870) {
    return 'MC';
  }

  // San Marino boundaries
  if (lat >= 43.893700 && lat <= 43.992093 && lng >= 12.403600 && lng <= 12.516667) {
    return 'SM';
  }

  // Vatican City boundaries
  if (lat >= 41.900000 && lat <= 41.907438 && lng >= 12.445644 && lng <= 12.458365) {
    return 'VA';
  }

  // Andorra boundaries
  if (lat >= 42.428823 && lat <= 42.655935 && lng >= 1.407186 && lng <= 1.786542) {
    return 'AD';
  }

  // Default fallback for unrecognized coordinates
  return 'US';
};

/**
 * Get country-specific gas station brands
 * @param {string} countryCode - Country code (US, CA, etc.)
 * @returns {Array} - Array of brand names for the country
 */
const getCountryBrands = (countryCode) => {
  const countryBrands = {
    'US': [
      'Shell', 'Exxon', 'Mobil', 'Chevron', 'BP', 'Costco', 
      'Sam\'s Club', '7-Eleven', 'Speedway', 'Circle K', 
      'Valero', 'Phillips 66', 'Marathon', 'Sunoco', 'Other'
    ],
    'CA': [
      'Petro-Canada', 'Shell', 'Esso', 'Chevron', 'Husky', 
      'Costco', 'Canadian Tire', 'Ultramar', 'Fas Gas', 
      'Co-op', 'Mohawk', 'Pioneer', 'Other'
    ],
    'UK': [
      'Shell', 'BP', 'Esso', 'Tesco', 'Sainsbury\'s', 'Asda', 
      'Morrisons', 'Texaco', 'Jet', 'Other'
    ],
    'AU': [
      'Shell', 'BP', 'Caltex', '7-Eleven', 'Coles Express', 
      'Woolworths', 'United Petroleum', 'Puma Energy', 'Other'
    ],
    'DE': [
      'Shell', 'BP', 'Aral', 'Total', 'Esso', 'Jet', 'HEM', 'Other'
    ],
    'FR': [
      'Total', 'Shell', 'BP', 'Esso', 'Elf', 'Leclerc', 'Intermarché', 'Other'
    ],
    'IT': [
      'Eni', 'Shell', 'BP', 'Total', 'Esso', 'Q8', 'Tamoil', 'Other'
    ],
    'ES': [
      'Repsol', 'Shell', 'BP', 'Cepsa', 'Galp', 'Total', 'Other'
    ],
    'NL': [
      'Shell', 'BP', 'Total', 'Esso', 'Tango', 'Q8', 'Other'
    ],
    'BE': [
      'Shell', 'BP', 'Total', 'Esso', 'Q8', 'Mango', 'Other'
    ],
    'CH': [
      'Shell', 'BP', 'Total', 'Esso', 'Avia', 'Migrol', 'Other'
    ],
    'AT': [
      'Shell', 'BP', 'OMV', 'Eni', 'Total', 'Avia', 'Other'
    ],
    'SE': [
      'Shell', 'BP', 'Preem', 'OKQ8', 'Circle K', 'Statoil', 'Other'
    ],
    'NO': [
      'Shell', 'BP', 'Circle K', 'YX', 'Best', 'Esso', 'Other'
    ],
    'DK': [
      'Shell', 'BP', 'Circle K', 'OK', 'Q8', 'F24', 'Other'
    ],
    'FI': [
      'Shell', 'BP', 'Neste', 'ABC', 'St1', 'Teboil', 'Other'
    ],
    'PL': [
      'Shell', 'BP', 'Orlen', 'Lotos', 'Circle K', 'Moya', 'Other'
    ],
    'CZ': [
      'Shell', 'BP', 'Benzina', 'MOL', 'OMV', 'EuroOil', 'Other'
    ],
    'HU': [
      'Shell', 'BP', 'MOL', 'OMV', 'Lukoil', 'Avanti', 'Other'
    ],
    'SK': [
      'Shell', 'BP', 'Slovnaft', 'OMV', 'Lukoil', 'Other'
    ],
    'SI': [
      'Shell', 'BP', 'Petrol', 'OMV', 'MOL', 'Other'
    ],
    'HR': [
      'Shell', 'BP', 'INA', 'OMV', 'Lukoil', 'Other'
    ],
    'BG': [
      'Shell', 'BP', 'Lukoil', 'OMV', 'Eko', 'Other'
    ],
    'RO': [
      'Shell', 'BP', 'OMV', 'Petrom', 'Lukoil', 'Other'
    ],
    'LT': [
      'Shell', 'BP', 'Orlen', 'Circle K', 'Viada', 'Other'
    ],
    'LV': [
      'Shell', 'BP', 'Circle K', 'Viada', 'Neste', 'Other'
    ],
    'EE': [
      'Shell', 'BP', 'Circle K', 'Neste', 'Viada', 'Other'
    ],
    'IE': [
      'Shell', 'BP', 'Esso', 'Topaz', 'Applegreen', 'Other'
    ],
    'PT': [
      'Shell', 'BP', 'Galp', 'Repsol', 'Total', 'Other'
    ],
    'GR': [
      'Shell', 'BP', 'EKO', 'Avin', 'Motor Oil', 'Other'
    ],
    'CY': [
      'Shell', 'BP', 'Petrolina', 'EKO', 'Other'
    ],
    'MT': [
      'Shell', 'BP', 'Total', 'Enemed', 'Other'
    ],
    'LU': [
      'Shell', 'BP', 'Total', 'Q8', 'Other'
    ],
    'IS': [
      'Shell', 'BP', 'N1', 'Olís', 'Orkan', 'Other'
    ],
    'LI': [
      'Shell', 'BP', 'Total', 'Other'
    ],
    'MC': [
      'Shell', 'BP', 'Total', 'Other'
    ],
    'SM': [
      'Shell', 'BP', 'Total', 'Other'
    ],
    'VA': [
      'Shell', 'BP', 'Total', 'Other'
    ],
    'AD': [
      'Shell', 'BP', 'Total', 'Other'
    ]
  };

  return countryBrands[countryCode] || countryBrands['US'];
};

module.exports = {
  detectCountryFromCoordinates,
  getCountryBrands
};
