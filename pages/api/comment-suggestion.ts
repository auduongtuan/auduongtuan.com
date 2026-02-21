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
    let cachedData = await getCommentSuggestionsCache(page);

    if (!cachedData || !cachedData.isFresh) {
      // Cache miss or expired - generate new suggestions
      // Construct full URL for Gemini API
      const fullUrl = `${process.env.NEXT_PUBLIC_PRODUCTION_WEB_URL}/${page}`;
      try {
        const newSuggestions = await getCommentSuggestion(fullUrl);
        // Store in Metadata database
        await setCommentSuggestionsCache(page, newSuggestions);
        return res.status(200).json(newSuggestions);
      } catch (error) {
        console.error("Error generating comment suggestions:", error);
        if (cachedData) {
          // If we have expired cache, return it with a warning
          console.warn("Returning expired cache due to generation error");
          return res.status(200).json(cachedData.commentSuggestions);
        }
        return res
          .status(500)
          .json({ error: "Failed to generate comment suggestions" });
      }
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default commentSuggestionAPI;
