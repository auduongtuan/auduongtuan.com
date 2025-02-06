import { SPOTIFY_REGEX, YOUTUBE_REGEX } from "@lib/utils/regex";
import { parse } from "html-metadata-parser";
import sharp from "sharp";

export type ThumbnailAndType = {
  url: string;
  width: number;
  height: number;
};

export async function getRawThumbnailUrlAndType(url: string) {
  try {
    const youtubeMatch = YOUTUBE_REGEX.exec(url);
    const spotifyMatch = SPOTIFY_REGEX.exec(url);
    let rawThumbnailUrl = "";
    if (youtubeMatch) {
      rawThumbnailUrl = `https://img.youtube.com/vi/${youtubeMatch[1]}/0.jpg`;
    } else if (spotifyMatch) {
      await fetch(
        `https://embed.spotify.com/oembed/?url=spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`,
      ).then(async (res) => {
        const info = await res.json();
        rawThumbnailUrl = info.thumbnail_url;
      });
    } else {
      const metadata = await parse(url);
      const imageUrl = metadata?.og?.image || metadata?.meta?.image;
      if (imageUrl) {
        rawThumbnailUrl = imageUrl;
      }
    }
    return [
      rawThumbnailUrl,
      youtubeMatch ? "youtube" : spotifyMatch ? "spotify" : "other",
    ];
  } catch (err) {
    return [null, null];
  }
}

export async function getThumbnailFromUrl(url: string) {
  const [rawThumbnailUrl, type] = await getRawThumbnailUrlAndType(url);
  if (rawThumbnailUrl) {
    const response = await fetch(rawThumbnailUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imgData = await sharp(buffer).metadata();
    const width = imgData.width || 0;
    const height = imgData.height || 0;
    return {
      url: "/api/website-thumbnail?url=" + encodeURIComponent(url),
      width,
      height,
    };
  }
}
