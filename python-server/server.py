#!/usr/bin/env python3
"""
YouTube Music API Server
Provides endpoints for searching and retrieving YouTube Music data
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ytmusicapi import YTMusic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize YTMusic
ytmusic = YTMusic()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'ytmusic-api'}), 200

@app.route('/search', methods=['GET'])
def search_song():
    """
    Search for a song on YouTube Music
    Query params:
    - q: search query (required)
    """
    query = request.args.get('q')

    if not query:
        return jsonify({'error': 'Missing query parameter: q'}), 400

    try:
        # Search for songs
        results = ytmusic.search(query + " audio", filter="songs")

        if not results:
            return jsonify({'error': 'No results found'}), 404

        song = results[0]

        # Format response similar to your existing API
        response = {
            'videoId': song.get('videoId'),
            'youtubeUrl': f"https://music.youtube.com/watch?v={song.get('videoId')}",
            'name': song.get('title'),
            'artist': song.get('artists', [{}])[0].get('name') if song.get('artists') else None,
            'album': song.get('album', {}).get('name') if song.get('album') else None,
            'duration': song.get('duration'),
            'thumbnails': song.get('thumbnails', []),
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error searching YouTube Music: {str(e)}")
        return jsonify({'error': 'Failed to search YouTube Music', 'details': str(e)}), 500

@app.route('/song/<video_id>', methods=['GET'])
def get_song(video_id):
    """
    Get detailed information about a specific song
    """
    try:
        song = ytmusic.get_song(video_id)
        return jsonify(song), 200
    except Exception as e:
        print(f"Error fetching song: {str(e)}")
        return jsonify({'error': 'Failed to fetch song', 'details': str(e)}), 500

@app.route('/lyrics/<video_id>', methods=['GET'])
def get_lyrics(video_id):
    """
    Get lyrics for a specific song
    """
    try:
        watch_playlist = ytmusic.get_watch_playlist(video_id)
        lyrics_browse_id = watch_playlist.get('lyrics')

        if not lyrics_browse_id:
            return jsonify({'error': 'No lyrics available'}), 404

        lyrics = ytmusic.get_lyrics(lyrics_browse_id)
        return jsonify(lyrics), 200
    except Exception as e:
        print(f"Error fetching lyrics: {str(e)}")
        return jsonify({'error': 'Failed to fetch lyrics', 'details': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'false').lower() == 'true'

    print(f"🎵 YouTube Music API Server starting on port {port}")
    print(f"📍 Available endpoints:")
    print(f"   GET /health - Health check")
    print(f"   GET /search?q=<query> - Search for songs")
    print(f"   GET /song/<video_id> - Get song details")
    print(f"   GET /lyrics/<video_id> - Get song lyrics")

    # Use debug mode only for local development
    # In production, use gunicorn: gunicorn server:app
    app.run(host='0.0.0.0', port=port, debug=debug)
