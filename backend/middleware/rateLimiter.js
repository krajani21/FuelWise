const rateLimit = require("express-rate-limit");

/**
 * Rate limiting middleware with different tiers for guests vs authenticated users
 * 
 * Strategy:
 * - Guest users: Rate limited by IP address (stricter limits)
 * - Authenticated users: Rate limited by user ID (more generous limits)
 */

/**
 * Create a flexible rate limiter that adjusts based on authentication status
 */
const createAdaptiveRateLimiter = (options) => {
  const {
    guestWindowMs = 15 * 60 * 1000, // 15 minutes for guests
    guestMaxRequests = 10, // 10 requests per 15 min for guests
    authWindowMs = 15 * 60 * 1000, // 15 minutes for authenticated
    authMaxRequests = 100, // 100 requests per 15 min for authenticated
    message = "Too many requests, please try again later."
  } = options;

  return rateLimit({
    windowMs: guestWindowMs,
    max: (req) => {
      // If user is authenticated, use generous limit
      if (req.user && req.user.id) {
        return authMaxRequests;
      }
      // Guest users get stricter limit
      return guestMaxRequests;
    },
    keyGenerator: (req) => {
      // Rate limit authenticated users by user ID
      if (req.user && req.user.id) {
        return `user:${req.user.id}`;
      }
      // Rate limit guests by IP address
      return `guest:${req.ip}`;
    },
    handler: (req, res) => {
      const isGuest = !req.user || !req.user.id;
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(guestWindowMs / 1000 / 60), // minutes
        isGuest,
        tip: isGuest ? "Sign up for higher rate limits and better features!" : "Please wait before making more requests."
      });
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Skip successful requests that hit cache
    skip: (req, res) => {
      // Skip counting if response is from cache (status code hasn't been set yet at this point)
      // We'll implement this with a custom header check
      return false;
    }
  });
};

/**
 * Rate limiter for expensive search operations (volume-based, distance-only)
 * These endpoints make external API calls and are expensive
 * 
 * COST ANALYSIS:
 * - Each search costs ~$0.50-0.66 in Google Maps API calls (without cache)
 * - With normalization + caching, actual API calls should be 20-30% of requests
 * - These limits balance user experience with cost control
 */
const searchRateLimiter = createAdaptiveRateLimiter({
  guestWindowMs: 15 * 60 * 1000, // 15 minutes
  guestMaxRequests: 5, // 5 searches per 15 min for guests (conservative for cost control)
  authWindowMs: 15 * 60 * 1000, // 15 minutes
  authMaxRequests: 30, // 30 searches per 15 min for authenticated (generous but safe)
  message: "Too many search requests. Please wait before searching again."
});

/**
 * Rate limiter for authentication endpoints (login, signup)
 * Prevent brute force attacks
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes per IP
  keyGenerator: (req) => `auth:${req.ip}`,
  message: "Too many authentication attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many authentication attempts from this IP. Please try again later.",
      retryAfter: 15 // minutes
    });
  }
});

/**
 * Rate limiter for password reset requests
 * Prevent abuse of email sending
 */
const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour per IP
  keyGenerator: (req) => `reset:${req.ip}`,
  message: "Too many password reset requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many password reset requests. Please try again in an hour.",
      retryAfter: 60 // minutes
    });
  }
});

/**
 * Global rate limiter - catches all other endpoints
 * Very generous, just to prevent extreme abuse
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 min per IP
  keyGenerator: (req) => `global:${req.ip}`,
  message: "Too many requests from this IP. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Middleware to optionally authenticate without blocking the request
 * Used before rate limiters to check if user is authenticated
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info for rate limiter
    } catch (err) {
      // Invalid token, treat as guest
      req.user = null;
    }
  } else {
    // No token, treat as guest
    req.user = null;
  }
  
  next();
};

module.exports = {
  searchRateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
  globalRateLimiter,
  optionalAuth
};

