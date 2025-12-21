import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommentSuggestion,
  getCommentSuggestionsCache,
  setCommentSuggestionsCache,
} from "@lib/commentSuggestion";

const commentSuggestionAPI = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "GET") {
    const page = Array.isArray(req.query.page)
      ? req.query.page[0]
      : req.query.page;

    if (!page) {
      return res.status(400).json({ error: "Missing page parameter" });
    }

    // Try to get cached suggestions from Metadata database
    let data = await getCommentSuggestionsCache(page);

    if (!data) {
      // Cache miss or expired - generate new suggestions
      // Construct full URL for Gemini API
      const fullUrl = `${process.env.NEXT_PUBLIC_PRODUCTION_WEB_URL}/${page}`;
      data = await getCommentSuggestion(fullUrl);
      // Store in Metadata database
      await setCommentSuggestionsCache(page, data);
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default commentSuggestionAPI;
