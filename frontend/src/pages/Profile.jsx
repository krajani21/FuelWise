import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, fetchGasStationBrands } from '../api/profile';
import { fetchVehicleMakes, fetchVehicleModels, fetchVehicleYears, validateVehicleCombination, fetchTankCapacity } from '../api/vehicles';
import { User, Car, Fuel, Star, Save, AlertCircle, CheckCircle, Edit, X } from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';

const Profile = () => {
  const [, setProfile] = useState(null);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

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
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [vehicleErrors, setVehicleErrors] = useState({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Load profile and brands on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, brandsData] = await Promise.all([
          fetchUserProfile(),
          fetchGasStationBrands()
        ]);

        setProfile(profileData);
        setAvailableBrands(brandsData);

        // Populate form with existing data
        if (profileData.vehicle) {
          setVehicle(profileData.vehicle);
          
                  // Load vehicle data based on existing values
        if (profileData.vehicle.make) {
          await loadModelsForMake(profileData.vehicle.make);
          if (profileData.vehicle.model) {
            await loadYearsForMakeModel(profileData.vehicle.make, profileData.vehicle.model);
            
            // Check if tank capacity can be auto-filled for existing vehicle
            if (profileData.vehicle.year) {
              const populated = await autoPopulateTankCapacity(
                profileData.vehicle.make, 
                profileData.vehicle.model, 
                profileData.vehicle.year, 
                false // Don't show message on initial load
              );
              if (!populated) {
                // If no auto-fill data available, user probably entered manually
                setIsAutoFilled(false);
              }
            }
          }
        }
        }
        if (profileData.preferences && profileData.preferences.preferredBrands) {
          setSelectedBrands(profileData.preferences.preferredBrands);
        }

        // Load initial makes
        await loadMakes();
      } catch (error) {
        console.error('Error loading profile data:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Vehicle data loading functions
  const loadMakes = async (searchQuery = '') => {
    try {
      setLoadingMakes(true);
      const makes = await fetchVehicleMakes(searchQuery);
      setMakeOptions(makes);
    } catch (error) {
      console.error('Error loading makes:', error);
      setVehicleErrors(prev => ({ ...prev, make: 'Failed to load vehicle makes' }));
    } finally {
      setLoadingMakes(false);
    }
  };

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
            text: `Tank capacity auto-filled: ${capacityData.tankCapacity}L for ${year} ${make} ${model} (you can edit if needed)` 
          });
          // Clear message after 4 seconds
          setTimeout(() => {
            setMessage({ type: '', text: '' });
          }, 4000);
        }
        return true; // Successfully populated
      }
    } catch (error) {
      console.error('Error fetching tank capacity:', error);
    }
    return false; // No data available
  };

  // Handle vehicle form changes
  const handleVehicleChange = async (field, value) => {
    const updatedVehicle = {
      ...vehicle,
      [field]: value
    };
    
    setVehicle(updatedVehicle);

    // Clear errors for this field
    setVehicleErrors(prev => ({ ...prev, [field]: null }));

    // Handle cascading changes
    if (field === 'make') {
      const resetVehicle = { ...updatedVehicle, model: '', year: '', tankCapacity: 50 };
      setVehicle(resetVehicle);
      setModelOptions([]);
      setYearOptions([]);
      setIsAutoFilled(false); // Reset auto-fill state when make changes
      
      if (value) {
        await loadModelsForMake(value);
      }
    } else if (field === 'model') {
      const resetVehicle = { ...updatedVehicle, year: '', tankCapacity: 50 };
      setVehicle(resetVehicle);
      setYearOptions([]);
      setIsAutoFilled(false); // Reset auto-fill state when model changes
      
      if (value && updatedVehicle.make) {
        await loadYearsForMakeModel(updatedVehicle.make, value);
      }
    } else if (field === 'year') {
      // When year is selected and we have make/model, automatically auto-populate tank capacity
      if (value && updatedVehicle.make && updatedVehicle.model) {
        const populated = await autoPopulateTankCapacity(updatedVehicle.make, updatedVehicle.model, value, true);
        if (!populated) {
          // If no data available, keep the current value or default
          setMessage({ 
            type: 'info', 
            text: `Tank capacity data not available for ${value} ${updatedVehicle.make} ${updatedVehicle.model}. Please enter manually.` 
          });
          setTimeout(() => {
            setMessage({ type: '', text: '' });
          }, 4000);
        }
      }
    }
  };

  // Handle brand selection
  const toggleBrand = (brand) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({ vehicle: {}, selectedBrands: [], isAutoFilled: false });

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original values
      setVehicle(originalData.vehicle);
      setSelectedBrands(originalData.selectedBrands);
      setIsAutoFilled(originalData.isAutoFilled);
      setIsEditing(false);
      setMessage({ type: '', text: '' });
    } else {
      // Store current values before editing
      setOriginalData({
        vehicle: { ...vehicle },
        selectedBrands: [...selectedBrands],
        isAutoFilled: isAutoFilled
      });
      setIsEditing(true);
      setMessage({ type: '', text: '' });
    }
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Validate required fields
      if (!vehicle.year || !vehicle.make || !vehicle.model || !vehicle.fuelType || !vehicle.tankCapacity) {
        setMessage({ type: 'error', text: 'Please fill in all required vehicle information' });
        return;
      }

      // Validate tank capacity
      if (vehicle.tankCapacity < 10 || vehicle.tankCapacity > 200) {
        setMessage({ type: 'error', text: 'Tank capacity must be between 10 and 200 liters' });
        return;
      }

      // Validate vehicle combination
      try {
        const validation = await validateVehicleCombination(vehicle.make, vehicle.model, vehicle.year);
        if (!validation.valid) {
          setMessage({ type: 'error', text: validation.error || 'Invalid vehicle combination' });
          return;
        }
      } catch (error) {
        console.error('Validation error:', error);
        setMessage({ type: 'error', text: 'Failed to validate vehicle combination' });
        return;
      }

      const profileData = {
        vehicle,
        preferences: {
          preferredBrands: selectedBrands
        }
      };

      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      setIsEditing(false); // Exit edit mode after successful save
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8 mr-3 text-[#4CAF50]" />
            <h1 className="text-3xl font-bold text-[#333333]">Profile Settings</h1>
          </div>
          {isEditing && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Edit Mode Active</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">Make your changes and click "Save Profile" or "Cancel" to exit</p>
            </div>
          )}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Vehicle Information Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Car className="h-6 w-6 mr-2 text-[#4CAF50]" />
            <h2 className="text-xl font-semibold text-[#333333]">Vehicle Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Make */}
            <div>
              <SearchableSelect
                label="Make"
                required
                options={makeOptions}
                value={vehicle.make}
                onChange={(value) => handleVehicleChange('make', value)}
                onSearch={loadMakes}
                placeholder="Search make..."
                loading={loadingMakes}
                error={vehicleErrors.make}
                disabled={!isEditing}
              />
            </div>

            {/* Model */}
            <div>
              <SearchableSelect
                label="Model"
                required
                options={modelOptions}
                value={vehicle.model}
                onChange={(value) => handleVehicleChange('model', value)}
                onSearch={(query) => loadModelsForMake(vehicle.make, query)}
                placeholder={vehicle.make ? "Search model..." : "Select make first"}
                loading={loadingModels}
                disabled={!isEditing || !vehicle.make}
                error={vehicleErrors.model}
              />
            </div>

            {/* Year */}
            <div>
              <SearchableSelect
                label="Year"
                required
                options={yearOptions.map(year => year.toString())}
                value={vehicle.year.toString()}
                onChange={(value) => handleVehicleChange('year', parseInt(value))}
                placeholder={vehicle.make && vehicle.model ? "Select year..." : "Select make & model first"}
                loading={loadingYears}
                disabled={!isEditing || !vehicle.make || !vehicle.model}
                error={vehicleErrors.year}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                <Fuel className="inline h-4 w-4 mr-1" />
                Fuel Type *
              </label>
              <select
                value={vehicle.fuelType}
                onChange={(e) => handleVehicleChange('fuelType', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Tank Capacity */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                <Fuel className="inline h-4 w-4 mr-1" />
                Tank Capacity (L) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={vehicle.tankCapacity}
                  onChange={(e) => {
                    handleVehicleChange('tankCapacity', parseFloat(e.target.value));
                    setIsAutoFilled(false); // Mark as manually edited
                  }}
                  onWheel={(e) => e.target.blur()}
                  min="10"
                  max="200"
                  step="0.1"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-200 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed border-gray-300' : 
                    isAutoFilled ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {vehicle.make && vehicle.model && vehicle.year && isEditing && (
                  <button
                    type="button"
                    onClick={() => autoPopulateTankCapacity(vehicle.make, vehicle.model, vehicle.year)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#4CAF50] hover:text-green-600 text-xs font-medium"
                    title="Auto-fill from vehicle database"
                  >
                    Auto-fill
                  </button>
                )}
              </div>
              <p className="text-xs mt-1">
                <span className="text-gray-500">Range: 10-200 liters</span>
                {isAutoFilled && (
                  <span className="text-green-600"> • Auto-filled from vehicle database</span>
                )}
                {!isAutoFilled && vehicle.make && vehicle.model && vehicle.year && isEditing && (
                  <span className="text-[#4CAF50]"> • Auto-fill available</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Gas Station Preferences Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 mr-2 text-[#4CAF50]" />
            <h2 className="text-xl font-semibold text-[#333333]">Preferred Gas Station Brands</h2>
            <span className="ml-2 text-sm text-gray-500">(Optional)</span>
          </div>
          
          <p className="text-gray-600 mb-4">
            Select your preferred gas station brands to get personalized recommendations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className={`flex items-center p-3 border rounded-lg transition-all duration-200 ${
                  selectedBrands.includes(brand)
                    ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#4CAF50] hover:bg-green-50'
                } ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => isEditing && toggleBrand(brand)}
                  disabled={!isEditing}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{brand}</span>
              </label>
            ))}
          </div>

          {selectedBrands.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Selected brands:</strong> {selectedBrands.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleEditToggle}
                disabled={saving}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#4CAF50] hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-[#4CAF50] hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
