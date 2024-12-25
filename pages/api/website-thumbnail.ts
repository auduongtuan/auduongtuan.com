import { parse } from "html-metadata-parser";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const metadata = await parse(url);
    const imageUrl = metadata?.og?.image || metadata?.meta?.image;

    if (!imageUrl) {
      return res.status(404).json({ error: "No image found in metadata" });
    }

    // Fetch the image and pipe it to the response
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", response.headers.get("content-type"));
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.end(buffer);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Failed to fetch metadata", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  }
}
