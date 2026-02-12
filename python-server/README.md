# YouTube Music API Server

Python server providing YouTube Music API endpoints using [ytmusicapi](https://github.com/sigma67/ytmusicapi).

## Setup

1. **One-time setup**
   ```bash
   ./setup.sh
   ```

2. **Run the server**
   ```bash
   ./run.sh
   ```

That's it! No virtual environment activation needed.

### Manual Setup (if needed)

```bash
python3 -m venv venv
venv/bin/pip install -r requirements.txt
cp .env.example .env
venv/bin/python server.py
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Search Songs
```
GET /search?q=<query>
```
Search for songs on YouTube Music.

**Example:**
```bash
curl "http://localhost:5000/search?q=billie+eilish+bad+guy"
```

**Response:**
```json
{
  "videoId": "DyDfgMOUjCI",
  "youtubeUrl": "https://music.youtube.com/watch?v=DyDfgMOUjCI",
  "name": "bad guy",
  "artist": "Billie Eilish",
  "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
  "duration": "3:14",
  "thumbnails": [...]
}
```

### Get Song Details
```
GET /song/<video_id>
```
Get detailed information about a specific song.

### Get Lyrics
```
GET /lyrics/<video_id>
```
Get lyrics for a specific song (if available).

## Authentication (Optional)

For authenticated requests, you can set up OAuth:

```bash
ytmusicapi oauth
```

This will create a `oauth.json` file. Update `server.py` to use it:

```python
ytmusic = YTMusic('oauth.json')
```

## Integration with Next.js

Update your Next.js API route to proxy to this server:

```typescript
// pages/api/ytmusic.ts
const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(q)}`);
const data = await response.json();
```

Or use the Python server directly from your frontend.

## Development

- Server runs on `http://localhost:5000` by default
- CORS is enabled for local development
- Set `DEBUG=true` in `.env` for development mode
