import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/profile';

/**
 * Custom hook to fetch and manage user's preferred gas station brands
 * @returns {Object} - {preferredBrands: Array, loading: boolean, error: string|null}
 */
export const usePreferredBrands = () => {
  const [preferredBrands, setPreferredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferredBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await fetchUserProfile();
        
        console.log('Profile data fetched:', profileData);
        console.log('Profile preferences:', profileData?.preferences);
        
        // Extract preferred brands from profile
        const brands = profileData?.preferences?.preferredBrands || [];
        console.log('Extracted preferred brands:', brands);
        setPreferredBrands(brands);
        
      } catch (err) {
        console.error('Error fetching preferred brands:', err);
        setError(err.message);
        // Set empty array as fallback so sorting still works
        setPreferredBrands([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      fetchPreferredBrands();
    } else {
      // No token, set empty array and stop loading
      setPreferredBrands([]);
      setLoading(false);
    }
  }, []);

  return {
    preferredBrands,
    loading,
    error
  };
};
