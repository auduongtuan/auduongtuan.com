# Deploying to Render

## Quick Deploy

1. **Push to Git**
   ```bash
   git add python-server/
   git commit -m "feat: add python ytmusic api server"
   git push
   ```

2. **Create New Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository
   - Use these settings:

   ```
   Name: ytmusic-api (or your preferred name)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn server:app
   ```

3. **Configure Environment**

   **Required:**
   - `ALLOWED_ORIGINS=https://auduongtuan.com` (restrict access to your domain)

   **Recommended:**
   - Generate API key: `openssl rand -hex 32`
   - `API_KEY=<your-generated-key>` (add extra authentication)

   **Optional:**
   - `DEBUG=false` (automatically set for production)
   - `PORT` is automatically set by Render

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy
   - You'll get a URL like: `https://ytmusic-api-xxxx.onrender.com`

## Using render.yaml (Alternative)

If you want to use the included `render.yaml` for Blueprint deployment:

1. Push the `render.yaml` file to your repo
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Select the `python-server/render.yaml` file
5. Deploy

## Update Next.js Environment Variables

After deployment, update your Next.js app:

**Local Development (.env.local):**
```env
YTMUSIC_API_URL=http://localhost:5000
```

**Vercel Production:**
Add environment variables in Vercel dashboard:
```
YTMUSIC_API_URL=https://ytmusic-api-xxxx.onrender.com
YTMUSIC_API_KEY=<same-key-as-render>  # If using API key
```

## Update Your Next.js API Route

```typescript
// pages/api/ytmusic.ts
const YTMUSIC_API_URL = process.env.YTMUSIC_API_URL || 'http://localhost:5001';
const YTMUSIC_API_KEY = process.env.YTMUSIC_API_KEY;

const ytmusicAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }

  try {
    const headers: HeadersInit = {};
    if (YTMUSIC_API_KEY) {
      headers['X-API-Key'] = YTMUSIC_API_KEY;
    }

    const response = await fetch(
      `${YTMUSIC_API_URL}/search?q=${encodeURIComponent(q)}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to search YouTube Music" });
  }
};

export default ytmusicAPI;
```

## Testing the Deployment

```bash
# Test the deployed API
curl "https://ytmusic-api-xxxx.onrender.com/health"
curl "https://ytmusic-api-xxxx.onrender.com/search?q=test"
```

## Notes

- **Free Tier**: Render's free tier spins down after 15 minutes of inactivity
  - First request after spin-down will be slow (~30s)
  - Consider upgrading to paid tier for better performance

- **CORS**: Already configured in the server for cross-origin requests

- **Logs**: View logs in Render dashboard for debugging

- **Auto-Deploy**: Enable auto-deploy to redeploy on git push
