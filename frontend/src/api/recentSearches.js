const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get user's recent searches from backend
export const fetchRecentSearches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent-searches`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent searches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return [];
  }
};

// Save a new recent search to backend
export const saveRecentSearch = async (searchData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent-searches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(searchData)
    });

    if (!response.ok) {
      throw new Error('Failed to save recent search');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving recent search:', error);
    throw error;
  }
};

// Delete a specific recent search
export const deleteRecentSearch = async (searchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent-searches/${searchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete recent search');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting recent search:', error);
    throw error;
  }
};

// Clear all recent searches for user
export const clearAllRecentSearches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recent-searches`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to clear recent searches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    throw error;
  }
};


