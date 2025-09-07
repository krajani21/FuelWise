import React, { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children, clearLocation }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate token on app startup
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem("token");
      
      if (savedToken) {
        try {
          // Test the token by making a request to a protected endpoint
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          
          if (response.ok) {
            // Token is valid
            setToken(savedToken);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          // Network error or server down, remove token to be safe
          console.error('Token validation failed:', error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    
    // Clear location data when logout occurs
    if (clearLocation) {
      clearLocation();
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
