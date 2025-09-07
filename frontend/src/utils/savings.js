export const getNearestStation = (stations) => {
  return stations.reduce((nearest, current) => {
    return current.distance < nearest.distance ? current : nearest;
  }, stations[0]);
};

export const calculateDollarSavings = (refPrice, targetPrice, litres) => {
  const savings = (refPrice - targetPrice) * litres; 
  return savings > 0 ? savings.toFixed(2) : null;
};

export const calculateCentDifference = (refPrice, targetPrice) => {
  const diff = (refPrice - targetPrice).toFixed(1);
  return diff > 0 ? `${diff}¢/L cheaper` : null;
};

export const calculateAreaStatistics = (stations) => {
  if (!stations || stations.length === 0) {
    return null;
  }

  const prices = stations
    .map(station => station.price)
    .filter(price => price != null && price > 0);

  if (prices.length === 0) {
    return null;
  }

  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  return {
    average: average.toFixed(2),
    lowest: lowest.toFixed(2),
    highest: highest.toFixed(2),
    stationCount: stations.length
  };
};
