# Security Features

The YouTube Music API server includes multiple layers of protection:

## 1. CORS Restrictions

Only allows requests from authorized domains:
- `https://auduongtuan.com` (production)
- `http://localhost:7777` (local development)

Configure via `ALLOWED_ORIGINS` environment variable:
```env
ALLOWED_ORIGINS=https://auduongtuan.com,http://localhost:7777
```

## 2. Origin/Referer Checking

All endpoints (except `/health`) verify the request origin matches allowed domains.

## 3. Rate Limiting

Protection against abuse:
- **Global**: 100 requests/hour, 20 requests/minute per IP
- **Search endpoint**: 30 requests/minute (more restrictive)
- **Health endpoint**: No limit

## 4. API Key Authentication (Optional)

Add an extra layer with API key authentication:

### Generate a secure API key:
```bash
openssl rand -hex 32
```

### On Render:
Add environment variable:
```
API_KEY=your_generated_key_here
```

### In Next.js:
```typescript
// .env.local
YTMUSIC_API_KEY=your_generated_key_here
```

```typescript
// pages/api/ytmusic.ts
const response = await fetch(
  `${YTMUSIC_API_URL}/search?q=${encodeURIComponent(q)}`,
  {
    headers: {
      'X-API-Key': process.env.YTMUSIC_API_KEY || ''
    }
  }
);
```

## Setup on Render

1. **Required**: Set `ALLOWED_ORIGINS`
   ```
   ALLOWED_ORIGINS=https://auduongtuan.com
   ```

2. **Optional**: Set `API_KEY` for extra security
   ```
   API_KEY=<your-secure-key>
   ```

3. **Add to Next.js**: Set `YTMUSIC_API_KEY` in Vercel environment variables

## Testing Security

### Test CORS (should fail from unauthorized origin):
```bash
curl -H "Origin: https://evil.com" "https://your-app.onrender.com/search?q=test"
# Returns 403 Forbidden
```

### Test rate limiting:
```bash
# Make 31 requests quickly
for i in {1..31}; do curl "https://your-app.onrender.com/search?q=test"; done
# 31st request returns 429 Too Many Requests
```

### Test API key:
```bash
# Without key (if API_KEY is set)
curl "https://your-app.onrender.com/search?q=test"
# Returns 401 Unauthorized

# With key
curl -H "X-API-Key: your-key" "https://your-app.onrender.com/search?q=test"
# Returns 200 OK
```

## Best Practices

1. **Use API Key in production** - Generate and set it on both Render and Vercel
2. **Monitor logs** - Check Render logs for suspicious activity
3. **Update rate limits** - Adjust based on your traffic patterns
4. **Keep dependencies updated** - Regularly update packages for security patches

## Rate Limit Customization

Edit `server.py` to adjust limits:

```python
# Global limits
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour", "20 per minute"],  # Adjust these
    storage_uri="memory://"
)

# Per-endpoint limits
@app.route('/search', methods=['GET'])
@limiter.limit("30 per minute")  # Adjust this
def search_song():
    # ...
```
