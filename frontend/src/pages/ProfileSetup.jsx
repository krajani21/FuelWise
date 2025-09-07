import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Star, Save, CheckCircle, ArrowRight } from 'lucide-react';
import { fetchVehicleMakes, fetchVehicleModels, fetchVehicleYears, fetchTankCapacity } from '../api/vehicles';
import { fetchGasStationBrands } from '../api/profile';
import SearchableSelect from '../components/SearchableSelect';
import { API_BASE_URL } from '../config/api';

const ProfileSetup = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [vehicle, setVehicle] = useState({
    year: new Date().getFullYear(),
    make: '',
    model: '',
    fuelType: 'Regular',
    tankCapacity: 50
  });

  const [selectedBrands, setSelectedBrands] = useState([]);

  // Vehicle data state
  const [makeOptions, setMakeOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [loadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [vehicleErrors, setVehicleErrors] = useState({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [makes, brands] = await Promise.all([
          fetchVehicleMakes(),
          fetchGasStationBrands()
        ]);
        setMakeOptions(makes);
        setAvailableBrands(brands);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setMessage({ type: 'error', text: 'Failed to load vehicle data' });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Auto-redirect after 10 minutes if user doesn't complete setup
    const timeout = setTimeout(() => {
      setMessage({ type: 'error', text: 'Profile setup timed out. Redirecting to home page...' });
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/');
        }
      }, 2000);
    }, 600000); // 10 minutes

    return () => clearTimeout(timeout);
  }, [onComplete, navigate]);

  // Vehicle data loading functions
  const loadModelsForMake = async (make, searchQuery = '') => {
    if (!make) {
      setModelOptions([]);
      return;
    }
    
    try {
      setLoadingModels(true);
      const models = await fetchVehicleModels(make, searchQuery);
      setModelOptions(models);
    } catch (error) {
      console.error('Error loading models:', error);
      setVehicleErrors(prev => ({ ...prev, model: 'Failed to load vehicle models' }));
    } finally {
      setLoadingModels(false);
    }
  };

  const loadYearsForMakeModel = async (make, model) => {
    if (!make || !model) {
      setYearOptions([]);
      return;
    }
    
    try {
      setLoadingYears(true);
      const years = await fetchVehicleYears(make, model);
      setYearOptions(years);
    } catch (error) {
      console.error('Error loading years:', error);
      setVehicleErrors(prev => ({ ...prev, year: 'Failed to load vehicle years' }));
    } finally {
      setLoadingYears(false);
    }
  };

  // Auto-populate tank capacity when make/model/year are complete
  const autoPopulateTankCapacity = async (make, model, year, showMessage = true) => {
    if (!make || !model || !year) return;
    
    try {
      const capacityData = await fetchTankCapacity(make, model, year);
      if (capacityData.available && capacityData.tankCapacity) {
        setVehicle(prev => ({ ...prev, tankCapacity: capacityData.tankCapacity }));
        setIsAutoFilled(true);
        if (showMessage) {
          setMessage({ 
            type: 'success', 
            text: `Tank capacity auto-filled: ${capacityData.tankCapacity}L for ${year} ${make} ${model}` 
          });
          setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
        return true;
      }
    } catch (error) {
      console.error('Error fetching tank capacity:', error);
    }
    return false;
  };

  // Handle vehicle form changes
  const handleVehicleChange = async (field, value) => {
    const updatedVehicle = {
      ...vehicle,
      [field]: value
    };
    
    setVehicle(updatedVehicle);
    setVehicleErrors(prev => ({ ...prev, [field]: null }));

    // Handle cascading changes
    if (field === 'make') {
      const resetVehicle = { ...updatedVehicle, model: '', year: '', tankCapacity: 50 };
      setVehicle(resetVehicle);
      setModelOptions([]);
      setYearOptions([]);
      setIsAutoFilled(false);
      
      if (value) {
        await loadModelsForMake(value);
      }
    } else if (field === 'model') {
      const resetVehicle = { ...updatedVehicle, year: '', tankCapacity: 50 };
      setVehicle(resetVehicle);
      setYearOptions([]);
      setIsAutoFilled(false);
      
      if (value && updatedVehicle.make) {
        await loadYearsForMakeModel(updatedVehicle.make, value);
      }
    } else if (field === 'year') {
      if (value && updatedVehicle.make && updatedVehicle.model) {
        await autoPopulateTankCapacity(updatedVehicle.make, updatedVehicle.model, value);
      }
    }
  };

  // Handle brand selection
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Validation
  const validateVehicle = () => {
    const errors = {};
    if (!vehicle.make) errors.make = 'Vehicle make is required';
    if (!vehicle.model) errors.model = 'Vehicle model is required';
    if (!vehicle.year) errors.year = 'Vehicle year is required';
    if (vehicle.tankCapacity < 10 || vehicle.tankCapacity > 200) {
      errors.tankCapacity = 'Tank capacity must be between 10L and 200L';
    }
    return errors;
  };

  // Navigation
  const nextStep = () => {
    if (currentStep === 1) {
      const errors = validateVehicle();
      if (Object.keys(errors).length > 0) {
        setVehicleErrors(errors);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Save profile and complete setup
  const handleComplete = async () => {
    try {
      setSaving(true);
      
      // Create user profile
      const profileData = {
        vehicle,
        preferences: {
          preferredBrands: selectedBrands
        }
      };

      // Get token from localStorage (set during signup)
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found. Please try signing up again.' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile setup complete! Welcome to FuelWise!' });
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  // Skip profile setup
  const handleSkip = () => {
    // Clear the token since user didn't complete setup
    localStorage.removeItem('token');
    if (onComplete) {
      onComplete();
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <h1 className="text-4xl font-bold text-[#003366] mb-2">Welcome to FuelWise!</h1>
          <p className="text-gray-600">Let's set up your profile to get the most out of your fuel savings</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-[#4CAF50] text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-[#4CAF50]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-800">
            {currentStep === 1 && 'Vehicle Information'}
            {currentStep === 2 && 'Fuel Preferences'}
            {currentStep === 3 && 'Review & Complete'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Step 1: Vehicle Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-6 flex items-center">
                <Car className="h-6 w-6 mr-2 text-[#4CAF50]" />
                Tell us about your vehicle
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Vehicle Make *
                  </label>
                  <SearchableSelect
                    options={makeOptions}
                    value={vehicle.make}
                    onChange={(value) => handleVehicleChange('make', value)}
                    placeholder="Select make..."
                    loading={loadingMakes}
                    error={vehicleErrors.make}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Vehicle Model *
                  </label>
                  <SearchableSelect
                    options={modelOptions}
                    value={vehicle.model}
                    onChange={(value) => handleVehicleChange('model', value)}
                    placeholder="Select model..."
                    loading={loadingModels}
                    disabled={!vehicle.make}
                    error={vehicleErrors.model}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Year *
                  </label>
                  <SearchableSelect
                    options={yearOptions}
                    value={vehicle.year}
                    onChange={(value) => handleVehicleChange('year', value)}
                    placeholder="Select year..."
                    loading={loadingYears}
                    disabled={!vehicle.make || !vehicle.model}
                    error={vehicleErrors.year}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={vehicle.fuelType}
                    onChange={(e) => handleVehicleChange('fuelType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  >
                    <option value="Regular">Regular (87)</option>
                    <option value="Premium">Premium (91-94)</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333] mb-2">
                    Tank Capacity (L) *
                    {isAutoFilled && (
                      <span className="ml-2 text-sm text-green-600 font-normal">
                        (Auto-filled)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={vehicle.tankCapacity}
                    onChange={(e) => handleVehicleChange('tankCapacity', parseFloat(e.target.value))}
                    min="10"
                    max="200"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  {vehicleErrors.tankCapacity && (
                    <p className="text-red-600 text-sm mt-1">{vehicleErrors.tankCapacity}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Fuel Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-6 flex items-center">
                <Star className="h-6 w-6 mr-2 text-[#4CAF50]" />
                Choose your preferred fuel stations
              </h2>
              
              <div>
                <p className="text-gray-600 mb-4">
                  Select your preferred gas station brands. We'll prioritize these when showing you fuel options.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleBrandToggle(brand)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedBrands.includes(brand)
                          ? 'border-[#4CAF50] bg-green-50 text-[#4CAF50]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 mt-3">
                  Don't worry - you can always change these preferences later in your profile.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-6 flex items-center">
                <Save className="h-6 w-6 mr-2 text-[#4CAF50]" />
                Review your profile
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Make:</span>
                    <span className="font-medium">{vehicle.make}</span>
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{vehicle.model}</span>
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{vehicle.year}</span>
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="font-medium">{vehicle.fuelType}</span>
                    <span className="text-gray-600">Tank Capacity:</span>
                    <span className="font-medium">{vehicle.tankCapacity}L</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Preferred Brands</h3>
                  {selectedBrands.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedBrands.map((brand) => (
                        <span key={brand} className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">
                          {brand}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No preferred brands selected</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {message.text && (
            <div className={`border rounded-lg p-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="bg-[#4CAF50] hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={saving}
                    className="bg-[#4CAF50] hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <CheckCircle className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
