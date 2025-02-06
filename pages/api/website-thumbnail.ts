import { getRawThumbnailUrlAndType } from "@lib/thumbnail";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const [rawThumbnailUrl] = await getRawThumbnailUrlAndType(url as string);
  if (!rawThumbnailUrl) {
    return res.status(404).json({ error: "Thumbnail not found" });
  }
  // Fetch the image and pipe it to the response
  const response = await fetch(rawThumbnailUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader("Content-Type", response.headers.get("content-type") as string);
  res.setHeader("Content-Length", buffer.length);
  res.setHeader("Cache-Control", "s-maxage=86400");

  res.end(buffer);
}
