/**
 * Simple in-memory metrics tracker
 * For production, use Redis or dedicated metrics service
 */

const metrics = {
  apiCalls: {
    total: 0,
    volume: 0,
    distance: 0
  },
  normalization: {
    totalRequests: 0,
    uniqueKeys: new Set()
  },
  timestamp: Date.now()
};

/**
 * Record an API call
 */
const recordApiCall = (type) => {
  metrics.apiCalls.total++;
  if (type === 'volume') metrics.apiCalls.volume++;
  if (type === 'distance') metrics.apiCalls.distance++;
};

/**
 * Record a normalized request
 */
const recordNormalizedRequest = (cacheKey) => {
  metrics.normalization.totalRequests++;
  metrics.normalization.uniqueKeys.add(cacheKey);
  
  // Log summary every 10 requests
  if (metrics.normalization.totalRequests % 10 === 0) {
    const summary = getMetrics();
    console.log("\n📊 === METRICS SUMMARY ===");
    console.log("Total Requests:", summary.normalization.totalRequests);
    console.log("Unique Keys:", summary.normalization.uniqueKeys);
    console.log("Cache Hit Potential:", summary.normalization.cacheHitPotential);
    console.log("Reduction:", summary.normalization.reduction);
    console.log("Uptime:", summary.uptime);
    console.log("========================\n");
  }
};

/**
 * Get current metrics
 */
const getMetrics = () => {
  const uniqueCount = metrics.normalization.uniqueKeys.size;
  const totalRequests = metrics.normalization.totalRequests;
  const cacheHitPotential = totalRequests > 0 
    ? ((totalRequests - uniqueCount) / totalRequests * 100).toFixed(1)
    : 0;
  
  const uptime = Math.floor((Date.now() - metrics.timestamp) / 1000);
  
  return {
    apiCalls: metrics.apiCalls,
    normalization: {
      totalRequests,
      uniqueKeys: uniqueCount,
      cacheHitPotential: `${cacheHitPotential}%`,
      reduction: `${((totalRequests - uniqueCount) / Math.max(totalRequests, 1) * 100).toFixed(1)}%`
    },
    uptime: `${uptime}s`
  };
};

/**
 * Reset metrics
 */
const resetMetrics = () => {
  metrics.apiCalls = { total: 0, volume: 0, distance: 0 };
  metrics.normalization = { totalRequests: 0, uniqueKeys: new Set() };
  metrics.timestamp = Date.now();
};

module.exports = {
  recordApiCall,
  recordNormalizedRequest,
  getMetrics,
  resetMetrics
};

