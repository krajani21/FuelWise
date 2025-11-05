# Rate Limiting Quick Start

## Summary

✅ **Rate limiting is now active** on your FuelWise backend!

## What Was Implemented

### 1. **New Files Created**
- `backend/middleware/rateLimiter.js` - Core rate limiting logic

### 2. **Modified Files**
- `backend/index.js` - Added global rate limiter and proxy trust
- `backend/routes/volumeBasedRoutes.js` - Added search rate limiting
- `backend/routes/distanceOnlyRoutes.js` - Added search rate limiting
- `backend/routes/authRoutes.js` - Added authentication rate limiting

### 3. **Package Installed**
- `express-rate-limit` - Industry-standard rate limiting library

## Rate Limits at a Glance

| Endpoint | Guest Limit | Auth Limit | Window |
|----------|-------------|------------|--------|
| Search (volume/distance) | 5 | 30 | 15 min |
| Login/Signup | 5 | 5 | 15 min |
| Password Reset | 3 | 3 | 60 min |
| All Other Endpoints | 200 | 200 | 15 min |

**Note:** Search limits are conservative to control Google Maps API costs (~$0.50-0.66 per search without cache).

## Key Features

### ✅ Dual-Tier System
- **Guest users**: Limited by IP address (stricter)
- **Authenticated users**: Limited by User ID (generous)

### ✅ Smart Detection
- Automatically detects if user is authenticated
- No changes needed to frontend - works transparently

### ✅ Helpful Error Messages
When limit exceeded, users get:
```json
{
  "error": "Too many requests, please try again later.",
  "retryAfter": 15,
  "isGuest": true,
  "tip": "Sign up for higher rate limits and better features!"
}
```

### ✅ Security Protection
- **DDoS prevention**: Can't spam 1000s of requests
- **Brute force protection**: Limited login attempts
- **Cost control**: Limits expensive Google API calls
- **Email abuse prevention**: Limited password reset emails

## How It Works

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Global Rate    │ ◄── 200 req/15min per IP
│    Limiter      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Optional Auth  │ ◄── Checks JWT token
│   Middleware    │     (doesn't block if missing)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Adaptive Rate  │ ◄── Guest: 10 req/15min (by IP)
│    Limiter      │     Auth: 100 req/15min (by User ID)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Your Route     │
│    Handler      │
└─────────────────┘
```

## Testing the Rate Limiter

### Quick Test (PowerShell)
```powershell
# Test guest user limit (make 11 requests)
1..11 | ForEach-Object {
  Invoke-RestMethod -Method POST `
    -Uri "http://localhost:5000/api/volume-based" `
    -ContentType "application/json" `
    -Body '{"origin":{"lat":43.6532,"lng":-79.3832},"budget":50,"efficiency":8.5,"radius":5}'
}
# The 11th request should fail with 429
```

### Check Rate Limit Status
Watch the response headers:
- `RateLimit-Limit`: Max requests allowed
- `RateLimit-Remaining`: Requests left
- `RateLimit-Reset`: When limit resets

## Adjusting Limits

To change rate limits, edit `backend/middleware/rateLimiter.js`:

```javascript
const searchRateLimiter = createAdaptiveRateLimiter({
  guestMaxRequests: 10,    // Change this for guest limit
  authMaxRequests: 100,    // Change this for auth limit
  guestWindowMs: 15 * 60 * 1000  // Change time window
});
```

## Common Scenarios

### Scenario 1: Guest User Makes 10 Searches
- ✅ Requests 1-10: Success
- ❌ Request 11: `429 Too Many Requests`
- 💡 Message: "Sign up for higher rate limits!"

### Scenario 2: Authenticated User Makes 100 Searches
- ✅ Requests 1-100: Success
- ❌ Request 101: `429 Too Many Requests`
- ⏰ Wait 15 minutes for reset

### Scenario 3: Failed Login Attempts
- ✅ Attempts 1-5: Allowed
- ❌ Attempt 6: `429 Too Many Requests`
- ⏰ Wait 15 minutes before trying again

## Production Deployment

### Important: Trust Proxy Setting
Already configured in `backend/index.js`:
```javascript
app.set('trust proxy', 1);
```

This is **critical** when deployed on:
- ✅ Render
- ✅ Heroku
- ✅ AWS
- ✅ Behind Nginx/Cloudflare

Without this, all requests appear to come from the proxy's IP!

## Next Steps (Optional)

For production with multiple servers, consider:
1. **Redis integration** for distributed rate limiting
2. **Custom limits** for premium users
3. **IP whitelisting** for trusted services
4. **Analytics** on rate limit hits

## Troubleshooting

**Issue**: Rate limits seem not to work
- Check: Is `trust proxy` enabled?
- Check: Is `express-rate-limit` installed?

**Issue**: All users hitting same limit
- Check: Is `optionalAuth` middleware before rate limiter?
- Check: Is JWT token being sent in Authorization header?

**Issue**: Too many false positives
- Solution: Increase `guestMaxRequests` or `authMaxRequests`

## Support

For detailed documentation, see `RATE_LIMITING.md`

