const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const verifyToken = require('../middleware/authMiddleware');
const { getCountryBrands } = require('../utils/countryDetection');

// GET /api/profile - Get user's profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await UserProfile.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update user's profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const { vehicle, preferences, country } = req.body;

    // Validate vehicle information
    if (vehicle) {
      if (!vehicle.year || !vehicle.make || !vehicle.model || !vehicle.fuelType || !vehicle.tankCapacity) {
        return res.status(400).json({ error: 'All vehicle fields are required' });
      }

      if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
        return res.status(400).json({ error: 'Invalid vehicle year' });
      }

      if (!['Regular', 'Premium', 'Diesel'].includes(vehicle.fuelType)) {
        return res.status(400).json({ error: 'Invalid fuel type' });
      }

      if (vehicle.tankCapacity < 10 || vehicle.tankCapacity > 200 || !Number.isFinite(vehicle.tankCapacity)) {
        return res.status(400).json({ error: 'Tank capacity must be between 10 and 200 liters' });
      }
    }

    // Validate country if provided
    if (country) {
      const validCountries = ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'SK', 'SI', 'HR', 'BG', 'RO', 'LT', 'LV', 'EE', 'IE', 'PT', 'GR', 'CY', 'MT', 'LU', 'IS', 'LI', 'MC', 'SM', 'VA', 'AD', 'Other'];
      if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'Invalid country code' });
      }
    }

    // Validate preferred brands if provided
    if (preferences && preferences.preferredBrands) {
      // Get valid brands based on user's country
      const userCountry = country || 'US'; // Default to US if no country provided
      const validBrands = getCountryBrands(userCountry);
      
      const invalidBrands = preferences.preferredBrands.filter(brand => !validBrands.includes(brand));
      if (invalidBrands.length > 0) {
        return res.status(400).json({ error: `Invalid brand(s): ${invalidBrands.join(', ')}` });
      }
    }

    // Find or create profile
    let profile = await UserProfile.findOne({ userId: req.user.id });
    
    if (profile) {
      // Update existing profile
      if (vehicle) {
        profile.vehicle = { ...profile.vehicle, ...vehicle };
      }
      if (preferences) {
        profile.preferences = { ...profile.preferences, ...preferences };
      }
      if (country) {
        profile.country = country;
      }
      profile.updatedAt = new Date();
    } else {
      // Create new profile
      profile = new UserProfile({
        userId: req.user.id,
        country: country || 'US',
        vehicle: vehicle || {
          year: new Date().getFullYear(),
          make: '',
          model: '',
          fuelType: 'Regular',
          tankCapacity: 50
        },
        preferences: preferences || {
          preferredBrands: []
        }
      });
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/brands - Get available gas station brands based on user's country
router.get('/brands', verifyToken, async (req, res) => {
  try {
    // Get user's profile to determine their country
    const profile = await UserProfile.getOrCreateProfile(req.user.id);
    const userCountry = profile.country || 'US';
    
    // Get country-specific brands
    const brands = getCountryBrands(userCountry);
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// POST /api/profile/country - Update user's country based on coordinates
router.post('/country', verifyToken, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }
    
    const { detectCountryFromCoordinates } = require('../utils/countryDetection');
    const country = detectCountryFromCoordinates(lat, lng);
    
    // Update user's profile with detected country
    let profile = await UserProfile.findOne({ userId: req.user.id });
    
    if (profile) {
      profile.country = country;
      profile.updatedAt = new Date();
    } else {
      profile = new UserProfile({
        userId: req.user.id,
        country: country,
        vehicle: {
          year: new Date().getFullYear(),
          make: '',
          model: '',
          fuelType: 'Regular',
          tankCapacity: 50
        },
        preferences: {
          preferredBrands: []
        }
      });
    }
    
    await profile.save();
    
    // Return the detected country and available brands
    const brands = getCountryBrands(country);
    res.json({ 
      country, 
      brands,
      message: `Country detected: ${country}`
    });
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({ error: 'Failed to update country' });
  }
});

module.exports = router;
