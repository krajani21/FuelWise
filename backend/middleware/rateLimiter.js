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
 * 
 * STRATEGY:
 * - Guest and auth limits are close to prevent abuse via fake account creation
 * - Auth limit slightly higher to incentivize signup, but not enough to encourage fake accounts
 * - Auth users tracked by User ID (can't bypass with VPN), guests by IP (easy to bypass)
 */
const searchRateLimiter = createAdaptiveRateLimiter({
  guestWindowMs: 15 * 60 * 1000, // 15 minutes
  guestMaxRequests: 100, // 100 searches per 15 min for guests (increased for testing)
  authWindowMs: 15 * 60 * 1000, // 15 minutes
  authMaxRequests: 200, // 200 searches per 15 min for authenticated (increased for testing)
  message: "Too many search requests. Please wait before searching again."
});

/**
 * Rate limiter for authentication endpoints (login, signup)
 * Dual-layer protection:
 * 1. Per-email limit: Prevents brute force on specific accounts
 * 2. Per-IP limit: Prevents mass attacks, but generous for shared networks
 */

// Layer 1: Rate limit by email (strict - prevents account brute force)
const authEmailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per email per 15 minutes
  keyGenerator: (req) => {
    const email = req.body?.email;
    return email ? `auth:email:${email.toLowerCase()}` : `auth:ip:${req.ip}`;
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  message: "Too many login attempts for this account. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts for this account. Please wait 15 minutes or reset your password.",
      retryAfter: 15 // minutes
    });
  }
});

// Layer 2: Rate limit by IP (generous - allows multiple users on same network)
const authIpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 attempts per IP per 15 minutes (high for shared networks)
  keyGenerator: (req) => `auth:ip:${req.ip}`,
  skipSuccessfulRequests: true,
  message: "Too many authentication attempts from this network. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many authentication attempts from this network. Please try again later.",
      retryAfter: 15 // minutes
    });
  }
});

// Combined middleware - both must pass
const authRateLimiter = [authEmailRateLimiter, authIpRateLimiter];

/**
 * Rate limiter for password reset requests
 * Dual-layer protection - same strategy as auth
 */

// Layer 1: Per-email limit (strict)
const resetEmailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per email per hour
  keyGenerator: (req) => {
    const email = req.body?.email;
    return email ? `reset:email:${email.toLowerCase()}` : `reset:ip:${req.ip}`;
  },
  skipSuccessfulRequests: true,
  message: "Too many password reset requests for this account.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many password reset requests for this account. Please try again in an hour.",
      retryAfter: 60 // minutes
    });
  }
});

// Layer 2: Per-IP limit (generous)
const resetIpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 attempts per IP per hour (allows shared networks)
  keyGenerator: (req) => `reset:ip:${req.ip}`,
  skipSuccessfulRequests: true,
  message: "Too many password reset requests from this network.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many password reset requests from this network. Please try again in an hour.",
      retryAfter: 60 // minutes
    });
  }
});

// Combined middleware
const passwordResetRateLimiter = [resetEmailRateLimiter, resetIpRateLimiter];

/**
 * Global rate limiter - catches all other endpoints
 * Very generous, just to prevent extreme abuse
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 min per IP (increased for testing)
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

