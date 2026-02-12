"""
Vercel Serverless Function - YouTube Music Search
"""
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from ytmusicapi import YTMusic
import json

ytmusic = YTMusic()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        # Get search query
        q = query_params.get('q', [None])[0]

        if not q:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Missing query parameter: q'}).encode())
            return

        try:
            # Search for songs
            results = ytmusic.search(q + " audio", filter="songs")

            if not results:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No results found'}).encode())
                return

            song = results[0]

            # Format response
            response = {
                'videoId': song.get('videoId'),
                'youtubeUrl': f"https://music.youtube.com/watch?v={song.get('videoId')}",
                'name': song.get('title'),
                'artist': song.get('artists', [{}])[0].get('name') if song.get('artists') else None,
                'album': song.get('album', {}).get('name') if song.get('album') else None,
                'duration': song.get('duration'),
                'thumbnails': song.get('thumbnails', []),
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Failed to search YouTube Music',
                'details': str(e)
            }).encode())
