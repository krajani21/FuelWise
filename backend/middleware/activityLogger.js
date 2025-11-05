const { logActivity, hashIP } = require('../utils/analytics');

/**
 * Middleware to log user activity after successful responses
 * Runs asynchronously so it doesn't slow down the response
 */
const activityLogger = (eventType, options = {}) => {
  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override res.json to log after successful response
    res.json = function(data) {
      // Send response first
      originalJson(data);

      // Then log activity asynchronously (don't await)
      setImmediate(async () => {
        try {
          const userId = req.user?.id || null;
          const guestId = userId ? null : hashIP(req.ip);
          
          await logActivity({
            userId,
            guestId,
            eventType,
            searchType: options.searchType || req.body?.searchType || null,
            cacheHit: options.cacheHit || res.locals?.cacheHit || null
          });
        } catch (error) {
          console.error('Activity logging error:', error);
        }
      });
    };

    next();
  };
};

module.exports = activityLogger;

