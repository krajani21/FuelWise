import axios from "axios";
import { API_BASE_URL } from '../config/api';

export const fetchDistances = async (userLocation, budget, efficiency) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/distances`, {
      origin: userLocation,
      budget,
      efficiency,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching distances:", error);
    throw error;
  }
};
