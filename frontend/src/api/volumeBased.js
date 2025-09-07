import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const fetchVolumeBased = async (origin, budget, efficiency, radius = 5, fuelType = 'Regular') => {
  console.log("API call with radius:", radius, "km, fuel type:", fuelType);
  const response = await axios.post(`${API_BASE_URL}/volume-based`, {
    origin,
    budget,
    efficiency,
    radius,
    fuelType
  });
  return response.data;
};
