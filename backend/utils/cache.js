/**
 * Simple in-memory cache with TTL
 */

const cache = new Map();

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if expired/not found
 */
const get = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  // Check if expired
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  console.log(`💾 Cache HIT: ${key.substring(0, 50)}...`);
  return item.value;
};

/**
 * Set value in cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttlSeconds - Time to live in seconds (default: 900 = 15 minutes)
 */
const set = (key, value, ttlSeconds = 900) => {
  const expiry = Date.now() + (ttlSeconds * 1000);
  cache.set(key, { value, expiry });
  console.log(`💾 Cache SET: ${key.substring(0, 50)}... (TTL: ${ttlSeconds}s)`);
};

/**
 * Clear expired entries (cleanup)
 */
const cleanup = () => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.expiry) {
      cache.delete(key);
    }
  }
};

/**
 * Get cache stats
 */
const getStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()).map(k => k.substring(0, 50))
  };
};

// Cleanup expired entries every 5 minutes
setInterval(cleanup, 5 * 60 * 1000);

module.exports = { get, set, getStats };

