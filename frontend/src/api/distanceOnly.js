import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const fetchDistanceOnly = async (origin, radius = 5, fuelType = 'Regular') => {
  const response = await axios.post(`${API_BASE_URL}/distances-only`, {
    origin,
    radius,
    fuelType
  });
  return response.data;
};
