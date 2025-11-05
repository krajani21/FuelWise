# Rate Limiting Documentation

## Overview

FuelWise implements a multi-tier rate limiting system to prevent abuse and ensure fair usage of the API. The system distinguishes between guest users and authenticated users, providing different rate limits for each.

## Rate Limiting Tiers

### 1. **Search Endpoints** (Volume-Based & Distance-Only)
These are the most expensive endpoints as they make external API calls to Google Maps.

| User Type | Limit | Window | Key |
|-----------|-------|--------|-----|
| **Guest** | 5 requests | 15 minutes | IP address |
| **Authenticated** | 10 requests | 15 minutes | User ID |

**Endpoints:**
- `POST /api/volume-based`
- `POST /api/distances-only`

### 2. **Authentication Endpoints**
Protected against brute force attacks and credential stuffing.

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/auth/signup` | 5 attempts | 15 minutes | IP address |
| `POST /api/auth/login` | 5 attempts | 15 minutes | IP address |

### 3. **Password Reset Endpoints**
Protected against email spam and abuse.

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/auth/forgot-password` | 3 attempts | 1 hour | IP address |
| `POST /api/auth/reset-password` | 3 attempts | 1 hour | IP address |

### 4. **Global Rate Limiter**
Catches all other endpoints to prevent general abuse.

| User Type | Limit | Window | Key |
|-----------|-------|--------|-----|
| **All** | 200 requests | 15 minutes | IP address |

## How It Works

### Guest Users
- Identified by **IP address**
- Stricter limits to prevent abuse
- Receive helpful error messages encouraging signup

### Authenticated Users
- Identified by **User ID** (from JWT token)
- More generous limits for better user experience
- Can make 10x more search requests than guests

### Optional Authentication
The system uses an `optionalAuth` middleware that:
1. Checks if a JWT token is present in the request
2. If valid, attaches user info to `req.user`
3. If invalid or missing, treats as guest user
4. Rate limiter then applies appropriate limits

## Error Responses

When rate limit is exceeded, the API returns a `429 Too Many Requests` status with:

```json
{
  "error": "Too many requests, please try again later.",
  "retryAfter": 15,
  "isGuest": true,
  "tip": "Sign up for higher rate limits and better features!"
}
```

### Response Headers
Standard rate limit headers are included:
- `RateLimit-Limit`: Maximum requests allowed in window
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Configuration

All rate limits are configurable in `backend/middleware/rateLimiter.js`:

```javascript
const searchRateLimiter = createAdaptiveRateLimiter({
  guestWindowMs: 15 * 60 * 1000,     // 15 minutes
  guestMaxRequests: 10,               // 10 requests for guests
  authWindowMs: 15 * 60 * 1000,      // 15 minutes
  authMaxRequests: 100,               // 100 requests for authenticated
  message: "Too many search requests."
});
```

## Important Notes

### 1. **Proxy Configuration**
The server is configured to trust proxy headers (`app.set('trust proxy', 1)`). This is essential when deployed behind reverse proxies like:
- Render
- Heroku
- Nginx
- Cloudflare

Without this, all requests would appear to come from the proxy's IP address.

### 2. **In-Memory Storage**
Currently, rate limits are stored **in-memory**. This means:
- ✅ Fast and simple
- ✅ No external dependencies
- ❌ Limits reset on server restart
- ❌ Won't work properly with multiple server instances

### 3. **Production Considerations**
For production with multiple server instances, consider using:
- **Redis** with `rate-limit-redis` package
- **MongoDB** with custom storage
- **Memcached** for distributed rate limiting

Example Redis integration:
```javascript
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const client = redis.createClient();

const searchRateLimiter = createAdaptiveRateLimiter({
  // ... other options
  store: new RedisStore({
    client: client,
    prefix: 'rl:search:'
  })
});
```

## Testing

### Test Guest User Limits
```bash
# Make 11 requests quickly from same IP
for i in {1..11}; do
  curl -X POST http://localhost:5000/api/volume-based \
    -H "Content-Type: application/json" \
    -d '{"origin":{"lat":43.6532,"lng":-79.3832},"budget":50,"efficiency":8.5,"radius":5}'
done
# 11th request should return 429
```

### Test Authenticated User Limits
```bash
# Login first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.token')

# Make requests with token (can make 100 before hitting limit)
curl -X POST http://localhost:5000/api/volume-based \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"origin":{"lat":43.6532,"lng":-79.3832},"budget":50,"efficiency":8.5,"radius":5}'
```

### Test Auth Endpoint Limits
```bash
# Make 6 login attempts quickly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@example.com","password":"wrong"}'
done
# 6th request should return 429
```

## Monitoring

Rate limit statistics are automatically included in standard response headers. Monitor these to:
- Track usage patterns
- Identify potential abuse
- Adjust limits as needed

## Security Benefits

1. **DDoS Protection**: Prevents server overload from excessive requests
2. **Brute Force Prevention**: Limits authentication attempts
3. **Cost Control**: Limits expensive Google Maps API calls
4. **Fair Usage**: Ensures resources are shared fairly among users
5. **Email Abuse Prevention**: Limits password reset emails

## Future Enhancements

Consider implementing:
1. **Redis-backed storage** for distributed rate limiting
2. **User-specific custom limits** (premium users, etc.)
3. **Dynamic rate limiting** based on server load
4. **Whitelist/blacklist** for specific IPs or users
5. **Rate limit bypass** for trusted services
6. **Detailed analytics** on rate limit hits

## Troubleshooting

### Issue: All requests appear to come from same IP
**Solution**: Ensure `app.set('trust proxy', 1)` is configured

### Issue: Rate limits too strict/lenient
**Solution**: Adjust values in `rateLimiter.js` configuration

### Issue: Authenticated users hitting guest limits
**Solution**: Check JWT token is being sent correctly and `optionalAuth` middleware is applied before rate limiter

### Issue: Rate limits reset unexpectedly
**Solution**: This is expected with in-memory storage. Server restarts clear all rate limit counters. Consider Redis for persistence.

