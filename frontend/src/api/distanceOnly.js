import axios from 'axios';

export const fetchDistanceOnly = async (origin, radius = 5, fuelType = 'Regular') => {
  const response = await axios.post("http://localhost:5000/api/distances-only", {
    origin,
    radius,
    fuelType
  });
  return response.data;
};
