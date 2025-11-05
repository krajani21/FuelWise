/**
 * Test script to verify query normalization
 * Run: node test-normalization.js
 */

const { normalizeSearchParams, generateCacheKey } = require('./utils/normalizeQuery');

console.log('\n=== Testing Query Normalization ===\n');

// Test 1: Coordinates within 100m should normalize to same value
console.log('Test 1: Nearby coordinates (should be identical)');
const test1a = normalizeSearchParams({
  origin: { lat: 45.5123456, lng: -73.5678901 },
  radius: 5,
  budget: 40,
  efficiency: 8.5,
  fuelType: 'Regular'
});
const test1b = normalizeSearchParams({
  origin: { lat: 45.5127890, lng: -73.5671234 }, // ~80m away
  radius: 5,
  budget: 40,
  efficiency: 8.5,
  fuelType: 'Regular'
});

console.log('Request A:', test1a.origin);
console.log('Request B:', test1b.origin);
console.log('Match:', test1a.origin.lat === test1b.origin.lat && test1a.origin.lng === test1b.origin.lng ? '✅' : '❌');
console.log('');

// Test 2: Radius bucketing
console.log('Test 2: Radius bucketing');
const radiusTests = [3, 5, 7, 12, 18, 25, 40];
radiusTests.forEach(r => {
  const normalized = normalizeSearchParams({
    origin: { lat: 45.5, lng: -73.5 },
    radius: r
  });
  console.log(`${r}km → ${normalized.radius}km`);
});
console.log('');

// Test 3: Budget/Efficiency rounding
console.log('Test 3: Budget/Efficiency rounding');
const test3a = normalizeSearchParams({
  origin: { lat: 45.5, lng: -73.5 },
  radius: 5,
  budget: 40.127,
  efficiency: 8.47
});
const test3b = normalizeSearchParams({
  origin: { lat: 45.5, lng: -73.5 },
  radius: 5,
  budget: 40.129,
  efficiency: 8.43
});

console.log('Request A: $' + test3a.budget + ', ' + test3a.efficiency + 'L/100km');
console.log('Request B: $' + test3b.budget + ', ' + test3b.efficiency + 'L/100km');
console.log('Match:', test3a.budget === test3b.budget && test3a.efficiency === test3b.efficiency ? '✅' : '❌');
console.log('');

// Test 4: Cache key generation
console.log('Test 4: Cache key consistency');
const test4a = normalizeSearchParams({
  origin: { lat: 45.5123456, lng: -73.5678901 },
  radius: 7,
  budget: 40.15,
  efficiency: 8.5,
  fuelType: 'Regular'
});
const test4b = normalizeSearchParams({
  origin: { lat: 45.5127890, lng: -73.5671234 },
  radius: 8,
  budget: 40.17,
  efficiency: 8.49,
  fuelType: 'Regular'
});

const key4a = generateCacheKey(test4a);
const key4b = generateCacheKey(test4b);

console.log('Key A:', key4a);
console.log('Key B:', key4b);
console.log('Match:', key4a === key4b ? '✅' : '❌');
console.log('');

// Test 5: Simulate 1000 users in 500m area
console.log('Test 5: Simulating 1000 users in 500m area');
const baseLatLng = { lat: 45.5, lng: -73.5 };
const uniqueKeys = new Set();

for (let i = 0; i < 1000; i++) {
  // Random offset within 500m (±0.0045° ≈ ±500m)
  const randomLat = baseLatLng.lat + (Math.random() - 0.5) * 0.009;
  const randomLng = baseLatLng.lng + (Math.random() - 0.5) * 0.009;
  
  const normalized = normalizeSearchParams({
    origin: { lat: randomLat, lng: randomLng },
    radius: 5,
    budget: 40,
    efficiency: 8.5
  });
  
  const key = generateCacheKey(normalized);
  uniqueKeys.add(key);
}

console.log('Total requests:', 1000);
console.log('Unique cache keys:', uniqueKeys.size);
console.log('Reduction:', ((1000 - uniqueKeys.size) / 1000 * 100).toFixed(1) + '%');
console.log('Cache hit rate potential:', ((1000 - uniqueKeys.size) / 1000 * 100).toFixed(1) + '%');
console.log('');

console.log('=== Tests Complete ===\n');

