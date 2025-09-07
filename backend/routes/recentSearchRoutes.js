const express = require('express');
const router = express.Router();
const RecentSearch = require('../models/RecentSearch');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/recent-searches - Get user's recent searches
router.get('/', verifyToken, async (req, res) => {
  try {
    const searches = await RecentSearch.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(3)
      .lean();

    // Format the response to match frontend expectations
    const formattedSearches = searches.map(search => ({
      id: search._id,
      amount: search.amount,
      efficiency: search.efficiency,
      location: search.location,
      coordinates: search.coordinates,
      timestamp: search.timestamp
    }));

    res.json(formattedSearches);
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    res.status(500).json({ error: 'Failed to fetch recent searches' });
  }
});

// POST /api/recent-searches - Add a new recent search
router.post('/', verifyToken, async (req, res) => {
  try {
    const { amount, efficiency, location, coordinates } = req.body;

    // Validate required fields
    if (!amount || !efficiency) {
      return res.status(400).json({ error: 'Amount and efficiency are required' });
    }

    // Create new search
    const newSearch = new RecentSearch({
      userId: req.user.id,
      amount: parseFloat(amount),
      efficiency: parseFloat(efficiency),
      location: location || 'Current Location',
      coordinates: coordinates || null
    });

    await newSearch.save();

    // Clean up old searches (keep only latest 3)
    await RecentSearch.cleanupOldSearches(req.user.id);

    // Return the created search
    const formattedSearch = {
      id: newSearch._id,
      amount: newSearch.amount,
      efficiency: newSearch.efficiency,
      location: newSearch.location,
      coordinates: newSearch.coordinates,
      timestamp: newSearch.timestamp
    };

    res.status(201).json(formattedSearch);
  } catch (error) {
    console.error('Error saving recent search:', error);
    res.status(500).json({ error: 'Failed to save recent search' });
  }
});

// DELETE /api/recent-searches/:id - Delete a specific recent search
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const search = await RecentSearch.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    await RecentSearch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Search deleted successfully' });
  } catch (error) {
    console.error('Error deleting recent search:', error);
    res.status(500).json({ error: 'Failed to delete recent search' });
  }
});

// DELETE /api/recent-searches - Clear all recent searches for user
router.delete('/', verifyToken, async (req, res) => {
  try {
    await RecentSearch.deleteMany({ userId: req.user.id });
    res.json({ message: 'All recent searches cleared successfully' });
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    res.status(500).json({ error: 'Failed to clear recent searches' });
  }
});

module.exports = router;

