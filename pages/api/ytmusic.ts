import type { NextApiRequest, NextApiResponse } from "next";
import YTMusic from "ytmusic-api";

let ytmusic: YTMusic | null = null;

async function getYTMusic() {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
  }
  return ytmusic;
}

const ytmusicAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }

  try {
    const yt = await getYTMusic();
    const results = await yt.searchSongs(q + " audio");

    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const song = results[0];

    return res.status(200).json({
      videoId: song.videoId,
      youtubeUrl: `https://music.youtube.com/watch?v=${song.videoId}`,
      name: song.name,
      artist: song.artist.name,
      album: song.album?.name ?? null,
      duration: song.duration,
      thumbnails: song.thumbnails,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to search YouTube Music" });
  }
};

export default ytmusicAPI;
