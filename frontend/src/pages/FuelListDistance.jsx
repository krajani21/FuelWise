import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDistanceOnly } from '../api/distanceOnly';
import { fetchUserProfile } from '../api/profile';
import { getNearestStation, calculateCentDifference, calculateAreaStatistics } from '../utils/savings';
import { sortByDistanceWithPreferred, isPreferredStation } from '../utils/preferredStations';
import { usePreferredBrands } from '../hooks/usePreferredBrands';
import { MapPin, Navigation, DollarSign, Map, RefreshCw, Star } from 'lucide-react';
import AreaStatistics from '../components/AreaStatistics';

const FuelListDistance = ({ userLocation }) => {
  const [stations, setStations] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [areaStats, setAreaStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userFuelType, setUserFuelType] = useState('Regular'); // Default fuel type
  const navigate = useNavigate();
  const { preferredBrands, loading: brandsLoading } = usePreferredBrands();

  // Fetch user profile to get fuel type preference
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        if (profile?.vehicle?.fuelType) {
          setUserFuelType(profile.vehicle.fuelType);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Keep default fuel type if profile fetch fails
      }
    };
    
    loadUserProfile();
  }, []);

  // Get URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const efficiency = urlParams.get('efficiency');
    const radius = urlParams.get('radius') || '5'; // Default to 5km if not provided
    
    if (amount && efficiency) {
      setSearchParams({
        amount: parseFloat(amount),
        efficiency: parseFloat(efficiency),
        radius: radius
      });
    }
  }, []);

  useEffect(() => {
    if (userLocation && !brandsLoading) {
      setIsLoading(true);
      setStations([]); // Clear previous results
      setAreaStats(null); // Clear previous area stats
      fetchDistanceOnly(userLocation, searchParams?.radius || 5, userFuelType)
        .then((data) => {
          console.log("Raw API data:", data);
          
          // Check if we have any stations before proceeding
          if (!data || data.length === 0) {
            console.log("No data or empty array received");
            setStations([]);
            setAreaStats(null);
            setIsLoading(false);
            return;
          }
          
          // Filter stations that have valid distance data for sorting
          const stationsWithDistance = data.filter(station => station.distance !== null);
          console.log("Stations with distance:", stationsWithDistance.length, "out of", data.length);
          
          // Use preferred brand sorting for stations with distance data
          const sorted = stationsWithDistance.length > 0 
            ? sortByDistanceWithPreferred(stationsWithDistance, preferredBrands)
            : data; // If no distance data, just use original order
          
          // Find nearest station for price comparison (use first station if no distance data)
          const nearest = stationsWithDistance.length > 0 
            ? getNearestStation(stationsWithDistance)
            : data[0];
          
          console.log("Nearest station:", nearest);
          const refPrice = nearest.price;

          const updated = sorted.map((station) => {
            const centsSaved = calculateCentDifference(refPrice, station.price);
            return { ...station, centsSaved };
          });

          setStations(updated);
          
          // Calculate and set area statistics (use stations with distance data if available)
          const stats = stationsWithDistance.length > 0 
            ? calculateAreaStatistics(stationsWithDistance)
            : null;
          setAreaStats(stats);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch distances:", err);
          setIsLoading(false);
        });
    }
  }, [userLocation, preferredBrands, brandsLoading, searchParams?.radius]);

  const handleGetDirections = (lat, lng) => {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleRefreshSearch = () => {
    // Navigate back to home with current search parameters
    const params = new URLSearchParams({
      amount: searchParams?.amount?.toString() || '',
      efficiency: searchParams?.efficiency?.toString() || '',
      radius: searchParams?.radius?.toString() || '5'
    });
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#333333] mb-6 flex items-center">
          <Map className="h-8 w-8 mr-3 text-[#4CAF50]" />
          Fuel Stations Sorted by Distance
        </h1>

        {preferredBrands && preferredBrands.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                <strong>Preferred brands prioritized:</strong> When stations have similar distances, your preferred brands ({preferredBrands.join(', ')}) will be shown first.
              </p>
            </div>
          </div>
        )}

        {searchParams && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-blue-800 text-sm">
                  <strong>Search Parameters:</strong> ${searchParams.amount} budget, {searchParams.efficiency} L/100km efficiency, {searchParams.radius}km radius
                </p>
              </div>
              <button 
                onClick={handleRefreshSearch}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Modify</span>
              </button>
            </div>
          </div>
        )}

        <AreaStatistics statistics={areaStats} />

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for fuel stations...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments for larger search areas</p>
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-4">
            {stations.map((station, index) => (
              <div key={index} className={`bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 ${
                isPreferredStation(station, preferredBrands) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#333333]">{station.station_name}</h3>
                      {isPreferredStation(station, preferredBrands) && (
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Preferred
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{station.address}</span>
                    </div>
                    <div className="flex items-center text-lg font-semibold text-[#4CAF50] mb-2">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${station.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-right mb-2">
                      <div className="text-2xl font-bold text-gray-800">
                        {station.duration_text && station.duration_text !== "Duration unavailable" 
                          ? station.duration_text 
                          : "Duration unavailable"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {station.distance && station.distance > 0 
                          ? `${(station.distance / 1000).toFixed(1)} km`
                          : station.distance_text && station.distance_text !== "Distance unavailable"
                          ? station.distance_text
                          : "Distance unavailable"}
                      </div>
                    </div>

                    <button
                      className="bg-[#4CAF50] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleGetDirections(station.lat, station.lng)}
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
                
                {/* Savings Display for Distance */}
                {station.centsSaved && areaStats && (() => {
                  const savingsMatch = station.centsSaved.match(/(\d+\.?\d*)\s*¢?\s*(cheaper|more expensive)/);
                  if (!savingsMatch) return null;
                  
                  const centAmount = parseFloat(savingsMatch[1]);
                  const isCheaper = savingsMatch[2] === 'cheaper';
                  
                  if (!isCheaper || centAmount <= 0) return null;
                  
                  return (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <span className="text-xs font-bold">💰</span>
                          </div>
                          <div>
                            <div className="font-bold text-green-800 text-sm">
                              {centAmount}¢ cheaper per L
                            </div>
                            <div className="text-green-600 text-xs">
                              vs nearest station
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Better Deal
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        {!isLoading && stations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No stations found. Please check your location settings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelListDistance;
