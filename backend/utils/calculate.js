const calculateEffectiveFuelVolume = ({ price_per_litre, distance_km, budget, efficiency_l_per_100km }) => {
  // Use round trip distance (distance * 2) for realistic travel costs
  const litresUsed = (distance_km * 2 * efficiency_l_per_100km) / 100;
  const travelCost = litresUsed * price_per_litre;

  const effectiveBudget = budget - travelCost;
  const fuelVolume = effectiveBudget > 0 ? effectiveBudget / price_per_litre : 0;

  return {
    travel_cost: travelCost.toFixed(2),
    effective_budget: effectiveBudget.toFixed(2),
    fuel_volume: fuelVolume.toFixed(2),
  };
};

module.exports = { calculateEffectiveFuelVolume };
