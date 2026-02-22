import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommentSuggestion,
  getCommentSuggestionsCache,
  setCommentSuggestionsCache,
} from "@lib/commentSuggestion";

function getQueryParam(
  param: string | string[] | undefined,
): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

const commentSuggestionAPI = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = getQueryParam(req.query.page);
  const lastEditedTime = getQueryParam(req.query.lastEditedTime);
  // const revalidateCache = Boolean(getQueryParam(req.query.revalidateCache));

  if (!page) {
    return res.status(400).json({ error: "Missing page parameter" });
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_PRODUCTION_WEB_URL}/${page}`;

  const generateAndCache = async () => {
    const newSuggestions = await getCommentSuggestion(fullUrl);
    await setCommentSuggestionsCache(page, newSuggestions);
    return newSuggestions;
  };

  const cachedData = await getCommentSuggestionsCache(page);

  if (
    !cachedData ||
    !lastEditedTime ||
    new Date(cachedData.lastEditedTime) < new Date(lastEditedTime)
  ) {
    try {
      return res.status(200).json(await generateAndCache());
    } catch (error) {
      console.error(
        "Error generating comment suggestions with revalidation:",
        error,
      );
      if (cachedData) {
        console.warn("Returning expired cache due to generation error");
        return res.status(200).json(cachedData.data);
      }
      return res.status(500).json({
        error: "Failed to generate comment suggestions with revalidation",
      });
    }
  }

  return res.status(200).json(cachedData.data);
};

export default commentSuggestionAPI;
