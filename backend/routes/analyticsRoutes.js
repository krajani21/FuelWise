const express = require('express');
const router = express.Router();
const { getDAU, getWAU, getMAU, getSearchStats, getSignupConversion } = require('../utils/analytics');

/**
 * GET /api/analytics
 * Get all analytics metrics
 */
router.get('/', async (req, res) => {
  try {
    const [dau, wau, mau, searchesToday, searchesWeek, conversion] = await Promise.all([
      getDAU(),
      getWAU(),
      getMAU(),
      getSearchStats(1), // Last 24 hours
      getSearchStats(7), // Last 7 days
      getSignupConversion(30) // Last 30 days
    ]);

    res.json({
      activeUsers: {
        daily: dau,
        weekly: wau,
        monthly: mau
      },
      searches: {
        today: searchesToday,
        last7Days: searchesWeek
      },
      conversion: conversion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * GET /api/analytics/dau
 * Get Daily Active Users
 */
router.get('/dau', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const dau = await getDAU(date);
    res.json(dau);
  } catch (error) {
    console.error('DAU error:', error);
    res.status(500).json({ error: 'Failed to fetch DAU' });
  }
});

/**
 * GET /api/analytics/wau
 * Get Weekly Active Users
 */
router.get('/wau', async (req, res) => {
  try {
    const wau = await getWAU();
    res.json(wau);
  } catch (error) {
    console.error('WAU error:', error);
    res.status(500).json({ error: 'Failed to fetch WAU' });
  }
});

/**
 * GET /api/analytics/mau
 * Get Monthly Active Users
 */
router.get('/mau', async (req, res) => {
  try {
    const mau = await getMAU();
    res.json(mau);
  } catch (error) {
    console.error('MAU error:', error);
    res.status(500).json({ error: 'Failed to fetch MAU' });
  }
});

/**
 * GET /api/analytics/searches
 * Get search statistics
 */
router.get('/searches', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 1;
    const stats = await getSearchStats(days);
    res.json(stats);
  } catch (error) {
    console.error('Search stats error:', error);
    res.status(500).json({ error: 'Failed to fetch search stats' });
  }
});

/**
 * GET /api/analytics/conversion
 * Get signup conversion rate
 */
router.get('/conversion', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const conversion = await getSignupConversion(days);
    res.json(conversion);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to fetch conversion stats' });
  }
});

module.exports = router;

