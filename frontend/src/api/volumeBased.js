import axios from 'axios';

export const fetchVolumeBased = async (origin, budget, efficiency, radius = 5, fuelType = 'Regular') => {
  console.log("API call with radius:", radius, "km, fuel type:", fuelType);
  const response = await axios.post("http://localhost:5000/api/volume-based", {
    origin,
    budget,
    efficiency,
    radius,
    fuelType
  });
  return response.data;
};
