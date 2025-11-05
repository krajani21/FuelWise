/**
 * In-flight request collapsing
 * Ensures only one upstream call happens for identical concurrent requests
 */

const inFlightRequests = new Map();

const collapseRequest = async (cacheKey, fn) => {
  if (inFlightRequests.has(cacheKey)) {
    console.log(`⏳ Collapsed! Waiting for in-flight: ${cacheKey.substring(0, 50)}...`);
    return inFlightRequests.get(cacheKey);
  }

  console.log(`🚀 New request: ${cacheKey.substring(0, 50)}...`);
  const promise = fn()
    .then(result => {
      inFlightRequests.delete(cacheKey);
      console.log(`✅ Completed: ${cacheKey.substring(0, 50)}...`);
      return result;
    })
    .catch(error => {
      inFlightRequests.delete(cacheKey);
      console.log(`❌ Failed: ${cacheKey.substring(0, 50)}...`);
      throw error;
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

const getInFlightCount = () => inFlightRequests.size;

module.exports = { collapseRequest, getInFlightCount };

