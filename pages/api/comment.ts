import { NextApiRequest, NextApiResponse } from "next";
import { createComment, getComments } from "@lib/notion/comment";

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 5; // Maximum requests per minute

const getRealIP = (req: NextApiRequest): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? (typeof forwarded === "string" ? forwarded : forwarded[0])?.split(
        ",",
      )?.[0]
    : req.socket.remoteAddress;
  return ip || "unknown";
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.timestamp < windowStart) {
      rateLimit.delete(key);
    }
  }

  const current = rateLimit.get(ip) || { count: 0, timestamp: now };

  if (current.timestamp < windowStart) {
    // Reset if outside window
    current.count = 1;
    current.timestamp = now;
  } else if (current.count >= MAX_REQUESTS) {
    return false;
  } else {
    current.count++;
  }

  rateLimit.set(ip, current);
  return true;
};

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create comment
  if (req.method === "POST") {
    const ip = getRealIP(req);

    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: {
          code: 429,
          message: "Too many requests. Please try again later.",
        },
      });
    }

    try {
      const data = {
        name: req.body.name,
        content: req.body.content,
        email: req.body.email,
        page: req.body.page,
        header: JSON.stringify(req.headers),
      };
      await createComment(data);
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        error: {
          code: 500,
          message: err,
        },
      });
    }
  }
  // Get comments
  if (req.method === "GET") {
    return res.status(200).json(await getComments(req.query.page));
  }
};

export default notionAPI;
