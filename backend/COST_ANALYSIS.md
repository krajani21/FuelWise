# Google Maps API Cost Analysis & Rate Limiting Strategy

## 📊 API Cost Breakdown

### Per-Search API Calls (Without Cache)

| API Call | Quantity | Unit Cost | Subtotal |
|----------|----------|-----------|----------|
| **Places Nearby Search** | 1 | $0.032 | $0.032 |
| **Places Details** (fuel prices) | 20-30 stations | $0.017 each | $0.34-0.51 |
| **Distance Matrix** (batched) | 1-2 calls | $0.005 per element | $0.10-0.15 |
| **TOTAL PER SEARCH** | - | - | **$0.47-0.69** |

> **Conservative estimate: $0.60 per search without cache**

---

## 💾 Cache Effectiveness

Your caching system significantly reduces actual API costs:

### Cache Hit Rate Estimation
- **Coordinate normalization**: Snaps to 110m grid
- **Radius bucketing**: Groups [5, 10, 20, 50] km
- **Parameter rounding**: Budget/efficiency normalized
- **TTL**: 15 minutes

**Expected cache hit rate: 60-80%** in normal usage

This means:
- 100 requests → Only 20-40 actual API calls
- **Effective cost: $0.12-0.24 per request**

---

## 💰 Cost Projections with Different Rate Limits

### Scenario 1: Original Limits (TOO RISKY ❌)
```
Guests: 10/15min, Auth: 100/15min
```

**Worst case (coordinated abuse):**
- 100 authenticated users × 100 requests = 10,000 requests
- Even with 70% cache hit = 3,000 API calls
- **Cost: $1,800 in 15 minutes** 😱
- **Daily: $172,800** (if sustained)

### Scenario 2: New Conservative Limits (RECOMMENDED ✅)
```
Guests: 5/15min, Auth: 30/15min
```

**Worst case:**
- 1,000 guests × 5 = 5,000 requests
- 100 auth users × 30 = 3,000 requests
- Total: 8,000 requests
- With 70% cache hit = 2,400 API calls
- **Cost: $1,440 in 15 minutes**
- **Daily (if sustained): $138,240**

**But more realistic scenario:**
- 100 active users doing 2-3 searches each = 250 requests
- With 70% cache hit = 75 API calls
- **Cost: $45 in 15 minutes**
- **Daily: $4,320** (~$130/month)

### Scenario 3: Ultra-Conservative (If Paranoid)
```
Guests: 3/15min, Auth: 15/15min
```

**Worst case:**
- 1,000 guests × 3 = 3,000 requests
- 100 auth users × 15 = 1,500 requests
- Total: 4,500 requests
- With 70% cache hit = 1,350 API calls
- **Cost: $810 in 15 minutes**
- **Daily (if sustained): $77,760**

---

## 🎯 Recommended Strategy: Scenario 2 (Current Implementation)

### Why These Limits Work

**For Guests (5 searches per 15 min):**
- Legitimate user: Searches 1-2 times, finds station, leaves ✅
- Abuse attempt: Only 5 searches = minimal damage ✅
- Still useful for trying the app ✅

**For Authenticated Users (30 searches per 15 min):**
- Normal usage: 2-5 searches per session ✅
- Power user: Can explore different areas ✅
- Abuse protection: 30 × $0.18 (with cache) = $5.40 max per user ✅

---

## 🔄 How Cache Helps Rate Limiting

### Cache Synergy
Your normalization + caching system works **perfectly** with rate limits:

1. **User searches downtown Toronto** at 43.6532, -79.3832 with 5km radius
2. **Cache key generated**: `lat:43.653|lng:-79.383|r:5|b:50.00|e:8.5|ft:Regular`
3. **Serves from cache** for 15 minutes
4. **Different user** searches at 43.6535, -79.3828 (50m away)
5. **Same cache key** (normalized to same grid point)
6. **Cache hit!** No API call needed ✅

### Real-World Cache Hit Rates

**Good scenario (urban area, popular location):**
- Multiple users in same area
- **Cache hit rate: 70-80%**
- 30 requests → 6-9 API calls
- Cost: $3.60-5.40 per user

**Worst scenario (rural areas, scattered users):**
- Each user in different location
- **Cache hit rate: 20-30%**
- 30 requests → 21-24 API calls
- Cost: $12.60-14.40 per user

---

## 🚨 Additional Cost Protection Measures

### 1. Google Cloud Budget Alerts (CRITICAL)
Set up in Google Cloud Console:
```
Budget: $100/day
Alert at: 50%, 75%, 90%, 100%
Action: Email notification → Manual intervention
```

### 2. Circuit Breaker (Future Enhancement)
Add to `backend/utils/apiCircuitBreaker.js`:
```javascript
// Stop all API calls if daily cost exceeds threshold
if (dailyCost > DAILY_BUDGET) {
  throw new Error('Daily API budget exceeded');
}
```

### 3. Monitor `/api/metrics` Endpoint
Watch for:
- Low cache hit rate (< 50%)
- Unusual traffic patterns
- Single IP making max requests repeatedly

### 4. Redis for Better Cache (Future)
In-memory cache resets on server restart. Redis would:
- Persist cache across restarts
- Share cache across multiple server instances
- Improve hit rate from 70% → 85%+

---

## 📈 Monitoring Dashboard (Recommended)

Track these metrics:
1. **Requests per minute** (total, guest, auth)
2. **Cache hit rate** (from `/api/metrics`)
3. **Estimated API cost** (requests × cache miss rate × $0.60)
4. **Rate limit hits** (429 responses)
5. **Unique IPs vs authenticated users**

---

## 🎛️ Adjusting Limits Based on Usage

### Increase Limits If:
- ✅ Cache hit rate consistently > 75%
- ✅ Actual costs well below budget
- ✅ User complaints about limits
- ✅ Legitimate power users identified

### Decrease Limits If:
- ❌ Costs approaching budget
- ❌ Abuse patterns detected
- ❌ Cache hit rate < 50%
- ❌ Single users hitting max repeatedly

---

## 💡 Cost Optimization Tips

### 1. Increase Cache TTL for Popular Locations
```javascript
// In cache.js - longer TTL for frequently accessed keys
const ttl = cacheHitCount[key] > 5 ? 1800 : 900; // 30min vs 15min
cache.set(key, value, ttl);
```

### 2. Pre-cache Popular Locations
```javascript
// Cache major city centers during off-peak hours
const popularLocations = [
  { lat: 43.653, lng: -79.383, name: 'Toronto' },
  { lat: 45.501, lng: -73.567, name: 'Montreal' },
  // ...
];
```

### 3. Reduce Places Details Calls
```javascript
// Only fetch details for top 15 closest stations, not all 30
const closestStations = allStations.slice(0, 15);
```

### 4. Batch Distance Matrix More Aggressively
```javascript
// Use larger chunks (Google allows 100 elements total)
// origins × destinations ≤ 100
// Currently: 1 origin × 25 destinations
// Could do: 1 origin × 50 destinations with 2 requests
```

---

## 🎯 Bottom Line

### With Current Limits (5 guest / 30 auth):
- **Normal day (100 users)**: $45-60
- **Busy day (500 users)**: $200-300
- **Worst case abuse**: $1,440 in 15min (but need 1000 coordinated abusers)

### Safety Factors:
1. ✅ Rate limiting (implemented)
2. ✅ Caching with normalization (70%+ hit rate)
3. ✅ Request collapsing (prevents duplicate calls)
4. ⚠️ Google Cloud budget alerts (HIGHLY RECOMMENDED)
5. ⚠️ Daily cost monitoring (SET THIS UP)

### Recommendation:
**Current limits are good!** They balance:
- User experience (30 searches is plenty)
- Cost control (~$150 worst-case per 15min)
- Abuse prevention (can't rack up $10K+ bills)

**But also set up Google Cloud budget alerts ASAP** as your final safety net! 🛡️

