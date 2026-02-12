# YouTube Music Python Server

Quick guide for using the Python server with ytmusicapi.

## Quick Start

### 1. Setup (First time only)

```bash
cd python-server
./setup.sh
```

### 2. Run the Server

```bash
cd python-server
./run.sh
```

That's it! No activation needed. The server will start on `http://localhost:5000`

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/search?q=<query>` | GET | Search for songs |
| `/song/<video_id>` | GET | Get song details |
| `/lyrics/<video_id>` | GET | Get song lyrics |

## Example Usage

### Search for a song
```bash
curl "http://localhost:5000/search?q=billie+eilish"
```

### From your Next.js API
```typescript
// pages/api/ytmusic.ts
const response = await fetch(
  `http://localhost:5000/search?q=${encodeURIComponent(q)}`
);
const data = await response.json();
```

## Authentication (Optional)

For better results and rate limits, you can authenticate:

```bash
cd python-server
source venv/bin/activate
ytmusicapi oauth
```

Then update `server.py`:
```python
ytmusic = YTMusic('oauth.json')  # Instead of YTMusic()
```

## Troubleshooting

**Port already in use?**
```bash
# Change port in .env file
echo "PORT=5001" > python-server/.env
```

**Virtual environment issues?**
```bash
cd python-server
rm -rf venv
./setup.sh
```

## Deployment to Render

See `python-server/DEPLOY.md` for complete deployment instructions.

**Quick steps:**
1. Push to git
2. Create new Web Service on Render
3. Point to your repository
4. Render auto-deploys!

## Integration with Next.js

**Update your API route to use the Python server:**

```typescript
// pages/api/ytmusic.ts
const YTMUSIC_API_URL = process.env.YTMUSIC_API_URL || 'http://localhost:5000';

const response = await fetch(
  `${YTMUSIC_API_URL}/search?q=${encodeURIComponent(q)}`
);
const data = await response.json();
```

**Environment variables:**
- Local: Add `YTMUSIC_API_URL=http://localhost:5000` to `.env.local`
- Production: Set `YTMUSIC_API_URL` in Vercel dashboard to your Render URL

See `python-server/README.md` for more details.
