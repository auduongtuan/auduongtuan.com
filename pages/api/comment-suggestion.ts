import { NextApiRequest, NextApiResponse } from "next";

import { getCommentSuggestion } from "@lib/commentSuggestion";

import { cache } from "@lib/utils/cache";

const commentSuggestionAPI = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // Get comments
  if (req.method === "GET") {
    const page = req.query.page as string;
    if (
      !page.startsWith(process.env.NEXT_PUBLIC_PRODUCTION_WEB_URL as string)
    ) {
      return res.status(400).json({ error: "Invalid page URL" });
    }
    const id = "comment-suggestion_" + page;
    let data = cache.get(id);
    if (!data) {
      const days = 31;
      data = await getCommentSuggestion(req.query.page as string);
      cache.set(id, data, days * 24 * 1000 * 60 * 60);
    }
    return res.status(200).json(data);
  }
};

export default commentSuggestionAPI;
