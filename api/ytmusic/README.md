# Vercel Serverless Functions - YouTube Music API

Backup implementation using Vercel Serverless Functions.

## Endpoints

When deployed to Vercel, these functions are available at:

- `GET /api/ytmusic/search?q=<query>` - Search for songs
- `GET /api/ytmusic/health` - Health check

## Usage

### Local Testing with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

### Deployment

These functions are automatically deployed when you push to Vercel.

### Environment Variables

No environment variables needed for basic functionality.

## Switching Between Implementations

### Use Render (Dedicated Python Server)
```env
NEXT_PUBLIC_YTMUSIC_API_URL=https://your-app.onrender.com
```

### Use Vercel Serverless Functions
```env
NEXT_PUBLIC_YTMUSIC_API_URL=https://auduongtuan.com/api/ytmusic
```

Or simply:
```typescript
// Use relative path - automatically uses Vercel functions
const ytmusicApiUrl = '/api/ytmusic';
```

## Differences from Render Implementation

**Render (Dedicated Server):**
- ✅ Faster cold starts
- ✅ Can maintain state/cache
- ✅ Full Flask features
- ✅ Better for high-traffic
- ❌ Requires separate deployment

**Vercel Serverless:**
- ✅ Same deployment as Next.js
- ✅ Auto-scaling
- ✅ Simple setup
- ❌ Cold starts (~1-2s)
- ❌ 10s timeout limit
- ❌ No persistent state

## Recommendation

- **Production**: Use Render for better performance
- **Backup/Fallback**: Vercel functions are already deployed
- **Development**: Use local Python server (port 5001)
