import querystring from 'querystring';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  return fetch(RECENTLY_PLAYED_ENDPOINT+'?limit=1', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });
};

const spotifyAPI = async (_, res) => {
  const response = await getNowPlaying();
  const extractTrackData = (track) => {
    return {
      title: track.name,
      artist: track.artists.map((_artist) => _artist.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images[0].url,
      songUrl: track.external_urls.spotify,
    }
  }

  if (response.status === 204 || response.status > 400) {
    const recentlyPlayed = await getRecentlyPlayed();
    const song = await recentlyPlayed.json();

    return res.status(200).json({
      isPlaying: false,
      ...extractTrackData(song.items[0]?.track)
    });
  }

  const song = await response.json();
  const isPlaying = song.is_playing;

  return res.status(200).json({
    isPlaying,
    ...extractTrackData(song.item)
  });
};

export default spotifyAPI;