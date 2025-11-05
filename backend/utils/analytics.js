const UserActivity = require('../models/UserActivity');
const crypto = require('crypto');

/**
 * Hash IP address for guest tracking (privacy-friendly)
 */
const hashIP = (ip) => {
  return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex').substring(0, 16);
};

/**
 * Log user activity event
 */
const logActivity = async ({ userId, guestId, eventType, searchType = null, cacheHit = null }) => {
  try {
    await UserActivity.create({
      userId,
      guestId,
      eventType,
      searchType,
      cacheHit,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - analytics shouldn't break the app
  }
};

/**
 * Get Daily Active Users (DAU)
 */
const getDAU = async (date = new Date()) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const result = await UserActivity.aggregate([
    {
      $match: {
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          guestId: '$guestId'
        }
      }
    },
    {
      $group: {
        _id: null,
        auth: {
          $sum: { $cond: [{ $ne: ['$_id.userId', null] }, 1, 0] }
        },
        guest: {
          $sum: { $cond: [{ $eq: ['$_id.userId', null] }, 1, 0] }
        }
      }
    }
  ]);

  if (result.length === 0) return { total: 0, auth: 0, guest: 0 };
  
  return {
    total: result[0].auth + result[0].guest,
    auth: result[0].auth,
    guest: result[0].guest
  };
};

/**
 * Get Weekly Active Users (WAU)
 */
const getWAU = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await UserActivity.aggregate([
    {
      $match: {
        timestamp: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          guestId: '$guestId'
        }
      }
    },
    {
      $group: {
        _id: null,
        auth: {
          $sum: { $cond: [{ $ne: ['$_id.userId', null] }, 1, 0] }
        },
        guest: {
          $sum: { $cond: [{ $eq: ['$_id.userId', null] }, 1, 0] }
        }
      }
    }
  ]);

  if (result.length === 0) return { total: 0, auth: 0, guest: 0 };
  
  return {
    total: result[0].auth + result[0].guest,
    auth: result[0].auth,
    guest: result[0].guest
  };
};

/**
 * Get Monthly Active Users (MAU)
 */
const getMAU = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await UserActivity.aggregate([
    {
      $match: {
        timestamp: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          guestId: '$guestId'
        }
      }
    },
    {
      $group: {
        _id: null,
        auth: {
          $sum: { $cond: [{ $ne: ['$_id.userId', null] }, 1, 0] }
        },
        guest: {
          $sum: { $cond: [{ $eq: ['$_id.userId', null] }, 1, 0] }
        }
      }
    }
  ]);

  if (result.length === 0) return { total: 0, auth: 0, guest: 0 };
  
  return {
    total: result[0].auth + result[0].guest,
    auth: result[0].auth,
    guest: result[0].guest
  };
};

/**
 * Get total searches per time period
 */
const getSearchStats = async (days = 1) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const result = await UserActivity.aggregate([
    {
      $match: {
        eventType: 'search',
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        volume: {
          $sum: { $cond: [{ $eq: ['$searchType', 'volume'] }, 1, 0] }
        },
        distance: {
          $sum: { $cond: [{ $eq: ['$searchType', 'distance'] }, 1, 0] }
        },
        cacheHits: {
          $sum: { $cond: [{ $eq: ['$cacheHit', true] }, 1, 0] }
        }
      }
    }
  ]);

  if (result.length === 0) {
    return { total: 0, volume: 0, distance: 0, cacheHits: 0, cacheHitRate: '0%' };
  }

  const stats = result[0];
  return {
    total: stats.total,
    volume: stats.volume,
    distance: stats.distance,
    cacheHits: stats.cacheHits,
    cacheHitRate: `${((stats.cacheHits / stats.total) * 100).toFixed(1)}%`
  };
};

/**
 * Get signup conversion rate (guests who became authenticated users)
 */
const getSignupConversion = async (days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get unique guests
  const guestCount = await UserActivity.distinct('guestId', {
    guestId: { $ne: null },
    timestamp: { $gte: startDate }
  });

  // Get signups
  const signupCount = await UserActivity.countDocuments({
    eventType: 'signup',
    timestamp: { $gte: startDate }
  });

  const totalGuests = guestCount.length;
  const conversionRate = totalGuests > 0 ? ((signupCount / totalGuests) * 100).toFixed(1) : 0;

  return {
    totalGuests,
    signups: signupCount,
    conversionRate: `${conversionRate}%`
  };
};

module.exports = {
  hashIP,
  logActivity,
  getDAU,
  getWAU,
  getMAU,
  getSearchStats,
  getSignupConversion
};

