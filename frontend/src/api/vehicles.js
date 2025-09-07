import { API_BASE_URL } from '../config/api';

// Helper function to get auth token
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };

// Helper function to create auth headers
const getAuthHeaders = () => {
  // const token = getAuthToken(); // Temporarily disabled
  return {
    'Content-Type': 'application/json',
    // Temporarily removing auth requirement for vehicle endpoints
    // ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get all vehicle makes (with optional search)
export const fetchVehicleMakes = async (searchQuery = '') => {
  try {
    const url = searchQuery 
      ? `${API_BASE_URL}/vehicles/makes?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/vehicles/makes`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || 'Failed to fetch vehicle makes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    throw error;
  }
};

// Get models for a specific make (with optional search)
export const fetchVehicleModels = async (make, searchQuery = '') => {
  try {
    const url = searchQuery 
      ? `${API_BASE_URL}/vehicles/models/${encodeURIComponent(make)}?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/vehicles/models/${encodeURIComponent(make)}`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || 'Failed to fetch vehicle models');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    throw error;
  }
};

// Get years for a specific make/model combination
export const fetchVehicleYears = async (make, model) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vehicles/years/${encodeURIComponent(make)}/${encodeURIComponent(model)}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || 'Failed to fetch vehicle years');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicle years:', error);
    throw error;
  }
};

// Validate a make/model/year combination
export const validateVehicleCombination = async (make, model, year) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ make, model, year })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || 'Failed to validate vehicle combination');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating vehicle combination:', error);
    throw error;
  }
};

// Search across makes and models
export const searchVehicles = async (query, type = 'all') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vehicles/search?query=${encodeURIComponent(query)}&type=${type}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || 'Failed to search vehicles');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching vehicles:', error);
    throw error;
  }
};

// Get tank capacity for a specific make/model/year combination
export const fetchTankCapacity = async (make, model, year) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vehicles/tank-capacity/${encodeURIComponent(make)}/${encodeURIComponent(model)}/${encodeURIComponent(year)}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      // If it's a 404, it means tank capacity data is not available
      if (response.status === 404) {
        return { tankCapacity: null, available: false };
      }
      throw new Error(errorData.error || 'Failed to fetch tank capacity');
    }

    const data = await response.json();
    return { tankCapacity: data.tankCapacity, available: true, ...data };
  } catch (error) {
    console.error('Error fetching tank capacity:', error);
    return { tankCapacity: null, available: false };
  }
};
