const express = require('express');
const router = express.Router();
const {
  getAllMakes,
  getModelsForMake,
  getYearsForMakeModel,
  isValidCombination,
  searchMakes,
  searchModels,
  getTankCapacity
} = require('../data/vehicleData');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/vehicles/makes - Get all vehicle makes (with optional search)
router.get('/makes', (req, res) => {
  try {
    const { search } = req.query;
    const makes = search ? searchMakes(search) : getAllMakes();
    res.json(makes);
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle makes' });
  }
});

// GET /api/vehicles/models/:make - Get models for a specific make (with optional search)
router.get('/models/:make', (req, res) => {
  try {
    const { make } = req.params;
    const { search } = req.query;
    
    if (!make) {
      return res.status(400).json({ error: 'Make parameter is required' });
    }
    
    const models = search ? searchModels(make, search) : getModelsForMake(make);
    res.json(models);
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle models' });
  }
});

// GET /api/vehicles/years/:make/:model - Get years for a specific make/model combination
router.get('/years/:make/:model', (req, res) => {
  try {
    const { make, model } = req.params;
    
    if (!make || !model) {
      return res.status(400).json({ error: 'Both make and model parameters are required' });
    }
    
    const years = getYearsForMakeModel(make, model);
    res.json(years);
  } catch (error) {
    console.error('Error fetching vehicle years:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle years' });
  }
});

// POST /api/vehicles/validate - Validate a make/model/year combination
router.post('/validate', (req, res) => {
  try {
    const { make, model, year } = req.body;
    
    if (!make || !model || !year) {
      return res.status(400).json({ 
        error: 'Make, model, and year are required',
        valid: false 
      });
    }
    
    const valid = isValidCombination(make, model, parseInt(year));
    
    if (valid) {
      res.json({ valid: true, message: 'Valid vehicle combination' });
    } else {
      res.json({ 
        valid: false, 
        error: `Invalid combination: ${make} ${model} for year ${year}` 
      });
    }
  } catch (error) {
    console.error('Error validating vehicle combination:', error);
    res.status(500).json({ error: 'Failed to validate vehicle combination', valid: false });
  }
});

// GET /api/vehicles/search - Search across makes and models
router.get('/search', (req, res) => {
  try {
    const { query, type = 'all' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    let results = {};
    
    if (type === 'makes' || type === 'all') {
      results.makes = searchMakes(query);
    }
    
    if (type === 'models' || type === 'all') {
      // Search models across all makes
      const allMakes = getAllMakes();
      results.models = {};
      
      allMakes.forEach(make => {
        const models = searchModels(make, query);
        if (models.length > 0) {
          results.models[make] = models;
        }
      });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error searching vehicles:', error);
    res.status(500).json({ error: 'Failed to search vehicles' });
  }
});

// GET /api/vehicles/tank-capacity/:make/:model/:year - Get tank capacity for specific vehicle
router.get('/tank-capacity/:make/:model/:year', (req, res) => {
  try {
    const { make, model, year } = req.params;
    
    if (!make || !model || !year) {
      return res.status(400).json({ error: 'Make, model, and year are required' });
    }
    
    const tankCapacity = getTankCapacity(make, model, parseInt(year));
    
    if (tankCapacity === null) {
      return res.status(404).json({ 
        error: 'Tank capacity data not available for this vehicle',
        tankCapacity: null 
      });
    }
    
    res.json({ 
      make, 
      model, 
      year: parseInt(year), 
      tankCapacity,
      message: `Tank capacity for ${year} ${make} ${model}` 
    });
  } catch (error) {
    console.error('Error fetching tank capacity:', error);
    res.status(500).json({ error: 'Failed to fetch tank capacity', tankCapacity: null });
  }
});

module.exports = router;
