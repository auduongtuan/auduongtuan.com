import { NextApiRequest, NextApiResponse } from "next";
import { createComment, getComments } from "../../lib/comment";
const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create comment
  if (req.method === "POST") {
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
