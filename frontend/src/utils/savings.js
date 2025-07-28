export const getNearestStation = (stations) => {
  return stations.reduce((nearest, current) => {
    return current.distance < nearest.distance ? current : nearest;
  }, stations[0]);
};

export const calculateDollarSavings = (refPrice, targetPrice, litres) => {
  const savings = (refPrice - targetPrice) * litres / 100; // cents to dollars
  return savings > 0 ? savings.toFixed(2) : null;
};

export const calculateCentDifference = (refPrice, targetPrice) => {
  const diff = (refPrice - targetPrice).toFixed(1);
  return diff > 0 ? `${diff}¢/L cheaper` : null;
};
