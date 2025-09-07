const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const verifyToken = require('../middleware/authMiddleware');

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
    const { vehicle, preferences } = req.body;

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

    // Validate preferred brands if provided
    if (preferences && preferences.preferredBrands) {
      const validBrands = [
        'Petro-Canada', 'Esso', 'Shell', 'Chevron', '7-Eleven', 'Hughes',
        'Safeway', 'HUSKY', 'Costco', 'Canadian Tire', 'Domo', 'Mobil'
      ];
      
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
      profile.updatedAt = new Date();
    } else {
      // Create new profile
      profile = new UserProfile({
        userId: req.user.id,
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

// GET /api/profile/brands - Get available gas station brands
router.get('/brands', verifyToken, async (req, res) => {
  try {
    const brands = [
      'Petro-Canada',
      'Esso',
      'Shell',
      'Chevron',
      '7-Eleven',
      'Hughes',
      'Safeway',
      'HUSKY',
      'Costco',
      'Canadian Tire',
      'Domo',
      'Mobil'
    ];
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

module.exports = router;
