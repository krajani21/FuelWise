# User Analytics Documentation

## Overview
MongoDB-based analytics tracking for DAU/WAU/MAU, searches, and conversion rates.

## What's Being Tracked
- **Searches** (volume & distance) - with cache hit tracking
- **Logins** - user authentication events
- **Signups** - new user registrations
- **Guest activity** - tracked via hashed IP (privacy-friendly)

## Analytics Endpoints

### Get All Analytics
```bash
GET /api/analytics
```

**Response:**
```json
{
  "activeUsers": {
    "daily": { "total": 45, "auth": 30, "guest": 15 },
    "weekly": { "total": 120, "auth": 85, "guest": 35 },
    "monthly": { "total": 450, "auth": 320, "guest": 130 }
  },
  "searches": {
    "today": {
      "total": 234,
      "volume": 150,
      "distance": 84,
      "cacheHits": 180,
      "cacheHitRate": "76.9%"
    },
    "last7Days": {
      "total": 1560,
      "volume": 980,
      "distance": 580,
      "cacheHits": 1170,
      "cacheHitRate": "75.0%"
    }
  },
  "conversion": {
    "totalGuests": 85,
    "signups": 12,
    "conversionRate": "14.1%"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Individual Metrics

**Daily Active Users:**
```bash
GET /api/analytics/dau
GET /api/analytics/dau?date=2025-01-14  # Specific date
```

**Weekly Active Users:**
```bash
GET /api/analytics/wau
```

**Monthly Active Users:**
```bash
GET /api/analytics/mau
```

**Search Statistics:**
```bash
GET /api/analytics/searches?days=1   # Last 24 hours
GET /api/analytics/searches?days=7   # Last 7 days
GET /api/analytics/searches?days=30  # Last 30 days
```

**Signup Conversion:**
```bash
GET /api/analytics/conversion?days=30
```

## How It Works

### 1. Activity Logging
Middleware automatically logs events after successful responses:
- Non-blocking (async)
- Doesn't slow down API responses
- Logs to MongoDB in background

### 2. Guest Tracking
- Guests identified by **hashed IP address** (privacy-friendly)
- Hash uses: `SHA256(IP + JWT_SECRET)`
- Can't reverse-engineer original IP

### 3. Data Retention
Events automatically deleted after **90 days** (MongoDB TTL index)

## Database Schema

```javascript
UserActivity {
  userId: ObjectId | null,        // null for guests
  guestId: String | null,         // hashed IP for guests
  eventType: 'search' | 'login' | 'signup',
  searchType: 'volume' | 'distance' | null,
  cacheHit: Boolean | null,
  timestamp: Date
}
```

**Indexes:**
- `userId + timestamp`
- `guestId + timestamp`
- `eventType + timestamp`
- `timestamp` (with 90-day TTL)

## Example Queries

### Get today's user activity
```bash
curl http://localhost:5000/api/analytics/dau
```

### Check cache effectiveness
```bash
curl http://localhost:5000/api/analytics/searches?days=7
```

### Monitor conversion funnel
```bash
curl http://localhost:5000/api/analytics/conversion?days=30
```

## Key Metrics Explained

### DAU/WAU/MAU
- **DAU** - Unique users in last 24 hours
- **WAU** - Unique users in last 7 days
- **MAU** - Unique users in last 30 days
- Split by auth/guest for conversion analysis

### Search Stats
- **Total** - All searches
- **Volume/Distance** - Breakdown by type
- **Cache Hits** - Requests served from cache
- **Cache Hit Rate** - Percentage of cached responses

### Conversion Rate
```
Conversion Rate = (Signups / Unique Guests) × 100
```
- Measures guest → authenticated user conversion
- Calculated over configurable time period (default: 30 days)

## Privacy & GDPR

✅ **Privacy-friendly:**
- IP addresses are hashed (one-way, can't reverse)
- No PII stored in events
- 90-day auto-deletion
- Full data ownership (no third parties)

❌ **Not tracked:**
- Email addresses
- User names
- Search locations
- Any personal information

## Performance Considerations

### Storage
- Each event: ~100 bytes
- 10,000 searches/day = ~1MB/day = ~30MB/month
- 90-day retention = ~90MB total
- **Very lightweight**

### Query Performance
- All queries use compound indexes
- Typical response time: 10-50ms
- Scales to millions of events

### No Impact on API Speed
- Logging happens **after** response sent
- Async/non-blocking
- Failures don't affect user experience

## Monitoring Tips

### Check Daily
```bash
curl http://localhost:5000/api/analytics
```

### Track Cache Effectiveness
Goal: >70% cache hit rate
```bash
curl http://localhost:5000/api/analytics/searches?days=1
```

### Monitor Conversion
Good: >10% conversion rate
```bash
curl http://localhost:5000/api/analytics/conversion
```

## Future Enhancements (Optional)

- **Retention cohorts** - Track users over time
- **Feature usage** - Profile views, recent searches
- **Geographic patterns** - Popular search locations
- **Time-of-day analysis** - Peak usage hours
- **Export to CSV** - For external analysis

