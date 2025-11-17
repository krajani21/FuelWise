import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Menu, 
  X, 
  Car, 
  DollarSign, 
  Clock,
  Fuel,
  Star,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { fetchRecentSearches, saveRecentSearch } from './api/recentSearches';
import { updateUserCountry } from './api/profile';
import FuelListVolume from './pages/FuelListVolume';
import FuelListDistance from './pages/FuelListDistance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HowItWorks from './pages/HowItWorks';
import LogoutButton from './components/LogoutButton';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Function to calculate relative time
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const searchTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};


const AppContent = ({ userLocation, setUserLocation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useContext(AuthContext);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fuelAmount, setFuelAmount] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [searchRadius, setSearchRadius] = useState('5'); // Default to 5km
  const [fuelType, setFuelType] = useState('Regular'); // Default to Regular
  const [filterByDistance, setFilterByDistance] = useState(false);
  const [filterBySavings, setFilterBySavings] = useState(true);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error
  const [recentSearches, setRecentSearches] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: location, 2: amount, 3: efficiency, 4: radius, 5: preferences, 6: get prices



  // Load recent searches and check for first-time user
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const searches = await fetchRecentSearches();
        // Update timeAgo for loaded searches
        const updated = searches.map(search => ({
          ...search,
          timeAgo: getTimeAgo(search.timestamp)
        }));
        setRecentSearches(updated);
      } catch (error) {
        console.error('Error loading recent searches:', error);
        setRecentSearches([]);
      }
    };

    // Only load searches if user is authenticated
    if (isAuthenticated) {
      loadRecentSearches();
    }

    // Check for onboarding
    const hasCompletedOnboarding = localStorage.getItem('fuelwise-onboarding-completed');
    
    // Show onboarding for first-time users (no completed onboarding)
    if (!hasCompletedOnboarding && location.pathname === '/search') {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000); // Show after 1 second delay
    }
  }, [location.pathname, isAuthenticated]);

  // Close mobile menu when navigating to a different page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Auto-focus inputs based on onboarding step
  useEffect(() => {
    if (showOnboarding) {
      switch (onboardingStep) {
        case 2:
          setTimeout(() => {
            document.getElementById('fuelAmount')?.focus();
          }, 500);
          break;
        case 3:
          setTimeout(() => {
            document.getElementById('fuelEfficiency')?.focus();
          }, 500);
          break;
        case 4:
          setTimeout(() => {
            document.getElementById('searchRadius')?.focus();
          }, 500);
          break;
        default:
          break;
      }
    }
  }, [onboardingStep, showOnboarding]);

  // Handle URL parameters on component mount (for refresh search functionality)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const amount = urlParams.get('amount');
    const efficiency = urlParams.get('efficiency');
    const radius = urlParams.get('radius');
    const fuelTypeParam = urlParams.get('fuelType');
    
    if (amount) {
      setFuelAmount(amount);
    }
    if (efficiency) {
      setFuelEfficiency(efficiency);
    }
    if (radius) {
      setSearchRadius(radius);
    }
    if (fuelTypeParam && ['Regular', 'Premium', 'Diesel'].includes(fuelTypeParam)) {
      setFuelType(fuelTypeParam);
    }
  }, [location.search]);

  // Function to add a new search to recent searches
  const addToRecentSearches = async (searchData) => {
    // Only save to backend if user is authenticated
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const newSearch = await saveRecentSearch({
        amount: searchData.amount,
        efficiency: searchData.efficiency,
        location: searchData.location || 'Current Location',
        coordinates: userLocation
      });

      // Add timeAgo property
      newSearch.timeAgo = getTimeAgo(newSearch.timestamp);

      // Update local state - backend handles duplicates and limits
      setRecentSearches(prevSearches => {
        // Remove any existing search with same amount and efficiency
        const filtered = prevSearches.filter(search => 
          !(search.amount === newSearch.amount && search.efficiency === newSearch.efficiency)
        );
        
        // Add new search at the beginning and limit to 3
        return [newSearch, ...filtered].slice(0, 3);
      });
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleGetLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      alert("Geolocation is not supported by this browser.");
      return;
    }

    // Configure geolocation options to ensure permission prompt appears
    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout to give user time to respond to permission dialog
      maximumAge: 0 // Don't use cached location, always get fresh location
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus('success');
        console.log("user location: ", coords);
        
        // Auto-detect country and update user profile (only if authenticated)
        if (isAuthenticated) {
          try {
            const countryData = await updateUserCountry(coords.lat, coords.lng);
            console.log("Country detected:", countryData.country);
            console.log("Available brands:", countryData.brands);
          } catch (error) {
            console.error("Error updating country:", error);
            // Don't fail the location process if country detection fails
          }
        }
        
        // Progress onboarding to next step
        if (showOnboarding && onboardingStep === 1) {
          setTimeout(() => {
            setOnboardingStep(2);
          }, 1000); // Move to fuel amount after 1 second
        }
      },
      (error) => {
        setLocationStatus('error');
        console.error("Error getting location: ", error);
        
        let errorMessage = "Unable to retrieve your location.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please:\n\n1. Click the location icon in your browser's address bar\n2. Select 'Allow' for location access\n3. Refresh the page and try again\n\nOr check your browser's privacy settings to allow location access for this site.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check that:\n\n1. Your device's location services are enabled\n2. You're not in airplane mode\n3. Your browser has permission to access location";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. This might happen if:\n\n1. You didn't respond to the permission dialog quickly enough\n2. Your device is having trouble getting a GPS signal\n\nPlease try again.";
            break;
          default:
            errorMessage = "An unknown error occurred while retrieving location. Please try again.";
            break;
        }
        
        alert(errorMessage);
      },
      options
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!userLocation) {
      alert('Please get your location first before searching.');
      return;
    }
    
    if (!fuelAmount || !fuelEfficiency) {
      alert('Please enter both fuel amount and vehicle efficiency.');
      return;
    }
    
    const amount = parseFloat(fuelAmount);
    const efficiency = parseFloat(fuelEfficiency);
    
    if (amount <= 0 || efficiency <= 0) {
      alert('Please enter valid positive numbers for fuel amount and efficiency.');
      return;
    }
    
    // Add to recent searches
    await addToRecentSearches({
      amount: amount,
      efficiency: efficiency,
      location: 'Current Location'
    });
    
    // Complete onboarding if active
    if (showOnboarding) {
      localStorage.setItem('fuelwise-onboarding-completed', 'true');
      setShowOnboarding(false);
      setOnboardingStep(1);
    }
    
    // Navigate to appropriate page based on search preference
    if (filterByDistance && !filterBySavings) {
      // Sort by distance only - use distance-only route
      navigate(`/distance?amount=${amount}&efficiency=${efficiency}&radius=${searchRadius}&fuelType=${fuelType}`);
    } else if (filterBySavings && !filterByDistance) {
      // Sort by max savings only - use volume-based route with savings sort
      navigate(`/volume?amount=${amount}&efficiency=${efficiency}&sort=savings&radius=${searchRadius}&fuelType=${fuelType}`);
    } else if (!filterByDistance && !filterBySavings) {
      // Default behavior (neither selected) - use volume-based route
      navigate(`/volume?amount=${amount}&efficiency=${efficiency}&radius=${searchRadius}&fuelType=${fuelType}`);
    } else {
      // Both checked - use volume-based with dual sorting
      navigate(`/volume?amount=${amount}&efficiency=${efficiency}&sort=both&radius=${searchRadius}&fuelType=${fuelType}`);
    }
  };

  // Function to handle clicking on a recent search
  const handleRecentSearchClick = (search) => {
    console.log('Recent search clicked:', search);
    setFuelAmount(search.amount.toString());
    setFuelEfficiency(search.efficiency.toString());
    // Note: Recent searches don't include radius, so it will use the default (5km)
    
    // Scroll to top of form for better UX
    document.getElementById('fuelAmount')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  // Handle fuel amount input with onboarding progression
  const handleFuelAmountChange = (e) => {
    setFuelAmount(e.target.value);
    if (showOnboarding && onboardingStep === 2 && e.target.value) {
      setTimeout(() => {
        setOnboardingStep(3);

      }, 500); // Move to efficiency after 0.5 seconds
    }
  };

  // Handle efficiency input 
  const handleEfficiencyChange = (e) => {
    setFuelEfficiency(e.target.value);
    if (showOnboarding && onboardingStep === 3 && e.target.value) {
      setTimeout(() => {
        setOnboardingStep(4);
      }, 800); // Move to preferences after 0.8 seconds
    }
  };

  // Function to start onboarding guide
  const startOnboardingGuide = () => {
    if (location.pathname !== '/search') {
      navigate('/search');
      setTimeout(() => {
        setShowOnboarding(true);
        setOnboardingStep(1);
      }, 300);
    } else {
      setShowOnboarding(true);
      setOnboardingStep(1);
    }
  };

  // Handle search radius change for onboarding
  const handleSearchRadiusChange = (e) => {
    setSearchRadius(e.target.value);
    if (showOnboarding && onboardingStep === 4 && e.target.value) {
      setTimeout(() => {
        setOnboardingStep(5);
      }, 500);
    }
  };

  // Handle search preference changes for onboarding
  const handleFilterByDistanceChange = (e) => {
    setFilterByDistance(e.target.checked);
    if (showOnboarding && onboardingStep === 5 && (e.target.checked || filterBySavings)) {
      setTimeout(() => {
        setOnboardingStep(6);
      }, 500);
    }
  };

  const handleFilterBySavingsChange = (e) => {
    setFilterBySavings(e.target.checked);
    if (showOnboarding && onboardingStep === 5 && (e.target.checked || filterByDistance)) {
      setTimeout(() => {
        setOnboardingStep(6);
      }, 500);
    }
  };

  // Update time ago for recent searches every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentSearches(prevSearches => 
        prevSearches.map(search => ({
          ...search,
          timeAgo: getTimeAgo(search.timestamp)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Define routes where LogoutButton should NOT appear
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const hideLogout = publicRoutes.includes(location.pathname) || !isAuthenticated;

  // Show loading screen while validating authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Validating authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#003366] text-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={isAuthenticated ? "/search" : "/"} className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-[#4CAF50]" />
              <span className="text-xl font-bold">FuelWise</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-[#4CAF50] transition-colors duration-200">Home</Link>
              <Link to="/how-it-works" className="hover:text-[#4CAF50] transition-colors duration-200">How It Works</Link>
              {isAuthenticated && (
                <Link to="/profile" className="hover:text-[#4CAF50] transition-colors duration-200">Profile</Link>
              )}
              <button 
                onClick={startOnboardingGuide}
                className="flex items-center space-x-1 hover:text-[#4CAF50] transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Quick Guide</span>
              </button>
              {isAuthenticated ? (
                !hideLogout && <LogoutButton />
              ) : (
                <>
                  <Link to="/login" className="hover:text-[#4CAF50] transition-colors duration-200">Login</Link>
                  <Link to="/signup" className="bg-[#4CAF50] hover:bg-green-600 px-4 py-2 rounded-lg transition-colors duration-200">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-[#4CAF50] transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#003366] border-t border-blue-700 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to="/" className="block py-2 hover:text-[#4CAF50] transition-colors duration-200">Home</Link>
              <Link to="/how-it-works" className="block py-2 hover:text-[#4CAF50] transition-colors duration-200">How It Works</Link>
              {isAuthenticated && (
                <Link to="/profile" className="block py-2 hover:text-[#4CAF50] transition-colors duration-200">Profile</Link>
              )}
              <button 
                onClick={() => {
                  startOnboardingGuide();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 py-2 hover:text-[#4CAF50] transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Quick Guide</span>
              </button>
              {isAuthenticated ? (
                !hideLogout && (
                  <div className="pt-2">
                    <LogoutButton />
                  </div>
                )
              ) : (
                <div className="pt-2 space-y-2">
                  <Link to="/login" className="block py-2 hover:text-[#4CAF50] transition-colors duration-200">Login</Link>
                  <Link to="/signup" className="block bg-[#4CAF50] hover:bg-green-600 px-4 py-2 rounded-lg transition-colors duration-200 text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
        </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/distance" element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FuelListDistance userLocation={userLocation} />
          </div>
        } />
        
        <Route path="/volume" element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FuelListVolume userLocation={userLocation} />
          </div>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* Main app route */}
        <Route path="/search" element={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Guest Mode Banner */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 text-sm font-medium">
                      You're using FuelWise as a guest
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      Sign up to save recent searches, vehicle info, and preferred gas stations
                    </p>
                  </div>
                  <Link 
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ml-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#003366] to-blue-800 rounded-2xl text-white p-8 mb-8 shadow-xl">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Choose your next fuel stop wisely
                </h1>
                <p className="text-lg mb-6 opacity-90">
                  Find the best fuel prices near you and save money on every fill-up
                </p>
                <button
                  onClick={handleGetLocation}
                  disabled={locationStatus === 'loading'}
                  className={`bg-[#4CAF50] hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
                    showOnboarding && onboardingStep === 1 ? 'animate-bounce ring-4 ring-[#4CAF50] ring-opacity-30' : ''
                  }`}
                >
                  {locationStatus === 'loading' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Navigation className="h-5 w-5" />
                  )}
                  <span>
                    {locationStatus === 'loading' ? 'Getting Location...' : 
                     locationStatus === 'success' ? 'Location Found!' :
                     locationStatus === 'error' ? 'Try Again' : 'Get Location'}
                  </span>
                </button>
                
              </div>
            </div>

            {/* Onboarding Tooltip */}
            {showOnboarding && (
              <div className="fixed inset-0 bg-black bg-opacity-20 z-40 pointer-events-none">
                <div className={`absolute transition-all duration-500 ${
                  onboardingStep === 1 ? 'top-96 left-1/2 transform -translate-x-1/2' :
                  onboardingStep === 2 ? 'top-1/2 left-1/4 transform -translate-y-1/2' :
                  onboardingStep === 3 ? 'top-1/2 right-1/4 transform -translate-y-1/2' :
                  onboardingStep === 4 ? 'top-1/2 left-1/2 transform -translate-y-1/2' :
                  onboardingStep === 5 ? 'bottom-1/2 left-1/2 transform -translate-x-1/2' :
                  'bottom-1/2 left-1/2 transform -translate-x-1/2'
                }`}>
                  <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs pointer-events-auto border-l-4 border-[#4CAF50]">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-[#4CAF50] rounded-full mr-2"></div>
                      <h4 className="font-semibold text-[#333333]">
                        {onboardingStep === 1 && "Step 1: Get Your Location"}
                        {onboardingStep === 2 && "Step 2: Enter Fuel Amount"}
                        {onboardingStep === 3 && "Step 3: Add Vehicle Efficiency"}
                        {onboardingStep === 4 && "Step 4: Set Search Radius"}
                        {onboardingStep === 5 && "Step 5: Select Search Preferences"}
                        {onboardingStep === 6 && "Step 6: Get Fuel Prices"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {onboardingStep === 1 && "Click 'Get Location' to enable location services. Your browser will ask for permission to access your location."}
                      {onboardingStep === 2 && "Enter how much you want to spend on fuel (e.g., $40)."}
                      {onboardingStep === 3 && "Enter your vehicle's fuel consumption (e.g., 8.5 L/100km)."}
                      {onboardingStep === 4 && "Choose how far to search for gas stations (5km to 50km)."}
                      {onboardingStep === 5 && "Choose to sort by distance (closest stations) or by savings (best deals)."}
                      {onboardingStep === 6 && "Click 'Find Best Fuel Prices' to search for nearby gas stations!"}
                    </p>
                    <button
                      onClick={() => {
                        localStorage.setItem('fuelwise-onboarding-completed', 'true');
                        setShowOnboarding(false);
                      }}
                      className="text-xs text-[#4CAF50] hover:text-green-600 font-medium"
                    >
                      Skip Guide
                    </button>
                  </div>
                </div>
              </div>
            )}



            <div className="flex justify-center">
              {/* Main Search Form */}
              <div className="w-full max-w-2xl">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-[#333333] mb-6">Find Your Best Deal</h2>
                  
                  <form onSubmit={handleSearch} className="space-y-6">
                    {/* Input Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fuelAmount" className="block text-sm font-medium text-[#333333] mb-2">
                          <DollarSign className="inline h-4 w-4 mr-1" />
                          Fuel Amount ($)
                        </label>
                        <input
                          type="number"
                          id="fuelAmount"
                          value={fuelAmount}
                          onChange={handleFuelAmountChange}
                          onWheel={(e) => e.target.blur()}
                          placeholder="Enter amount to fuel up"
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                            showOnboarding && onboardingStep === 2 ? 'animate-pulse ring-2 ring-[#4CAF50] ring-opacity-50' : ''
                          }`}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="fuelEfficiency" className="block text-sm font-medium text-[#333333] mb-2">
                          <Car className="inline h-4 w-4 mr-1" />
                          Vehicle Efficiency (L/100 km)
                        </label>
                        <input
                          type="number"
                          id="fuelEfficiency"
                          value={fuelEfficiency}
                          onChange={handleEfficiencyChange}
                          onWheel={(e) => e.target.blur()}
                          placeholder="Fuel consumption rate"
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                            showOnboarding && onboardingStep === 3 ? 'animate-pulse ring-2 ring-[#4CAF50] ring-opacity-50' : ''
                          }`}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>

                    {/* Search Radius */}
                    <div>
                      <label htmlFor="searchRadius" className="block text-sm font-medium text-[#333333] mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Search Radius (km)
                      </label>
                      <select
                        id="searchRadius"
                        value={searchRadius}
                        onChange={handleSearchRadiusChange}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                          showOnboarding && onboardingStep === 4 ? 'animate-pulse ring-2 ring-[#4CAF50] ring-opacity-50' : ''
                        }`}
                      >
                        <option value="5">5 km (Default)</option>
                        <option value="10">10 km</option>
                        <option value="20">20 km</option>
                        <option value="50">50 km</option>
                      </select>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label htmlFor="fuelType" className="block text-sm font-medium text-[#333333] mb-2">
                        <Fuel className="inline h-4 w-4 mr-1" />
                        Fuel Type
                      </label>
                      <select
                        id="fuelType"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200"
                      >
                        <option value="Regular">Regular (Default)</option>
                        <option value="Premium">Premium</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>

                    {/* Filter Options */}
                    <div className={`${
                      showOnboarding && onboardingStep === 5 ? 'animate-pulse ring-2 ring-[#4CAF50] ring-opacity-50 rounded-lg p-4' : ''
                    }`}>
                      <h3 className="text-lg font-medium text-[#333333] mb-4">Search Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={filterBySavings}
                              onChange={handleFilterBySavingsChange}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              filterBySavings 
                                ? 'bg-[#4CAF50] border-[#4CAF50]' 
                                : 'border-gray-300 group-hover:border-[#4CAF50]'
                            }`}>
                              {filterBySavings && <div className="w-3 h-3 bg-white rounded-sm"></div>}
                            </div>
                          </div>
                          <span className="ml-3 text-[#333333] group-hover:text-[#003366] transition-colors duration-200">
                            <Star className="inline h-4 w-4 mr-1" />
                            Sort by Max Savings
                          </span>
                        </label>
                        
                        <label className="flex items-center cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={filterByDistance}
                              onChange={handleFilterByDistanceChange}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              filterByDistance 
                                ? 'bg-[#4CAF50] border-[#4CAF50]' 
                                : 'border-gray-300 group-hover:border-[#4CAF50]'
                            }`}>
                              {filterByDistance && <div className="w-3 h-3 bg-white rounded-sm"></div>}
                            </div>
                          </div>
                          <span className="ml-3 text-[#333333] group-hover:text-[#003366] transition-colors duration-200">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Sort by Distance
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      type="submit"
                      className={`w-full bg-[#4CAF50] hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        showOnboarding && onboardingStep === 6 ? 'animate-pulse ring-4 ring-[#4CAF50] ring-opacity-50' : ''
                      }`}
                    >
                      <Search className="h-5 w-5" />
                      <span>Find Best Fuel Prices</span>
                    </button>
                  </form>
                </div>

                {/* Recent Searches */}
                {isAuthenticated && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-[#333333] mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-[#4CAF50]" />
                      Recent Searches
                    </h3>
                    <div className="space-y-3">
                      {recentSearches.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No recent searches yet</p>
                          <p className="text-sm">Your search history will appear here</p>
                        </div>
                      ) : (
                      recentSearches.map((search, index) => (
                        <div
                          key={search.id || index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#4CAF50] hover:text-white cursor-pointer transition-all duration-200 group border border-transparent hover:border-[#4CAF50] hover:shadow-md"
                        >
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-4 w-4 text-[#4CAF50] group-hover:text-white" />
                            <div>
                              <p className="font-medium text-[#333333] group-hover:text-white">
                                ${search.amount} • {search.efficiency}L/100km
                              </p>
                              <p className="text-sm text-gray-600 group-hover:text-gray-100">{search.timeAgo}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-[#4CAF50] group-hover:text-white font-semibold text-sm">
                            <RefreshCw className="h-4 w-4" />
                            <span>Use Again</span>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </main>
        } />
        
        {/* Root route - landing page for guests, redirect to search for authenticated */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to="/search" replace />
          ) : (
            <LandingPage />
          )
        } />

        {/* Info Pages */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        
        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  const [userLocation, setUserLocation] = useState(null);

  // Function to clear location data on logout
  const clearLocation = () => {
    setUserLocation(null);
  };

  return (
    <AuthProvider clearLocation={clearLocation}>
      <Router>
        <AppContent userLocation={userLocation} setUserLocation={setUserLocation} />
      </Router>
    </AuthProvider>
  );
}

export default App;
