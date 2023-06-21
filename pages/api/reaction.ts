import { NextApiRequest, NextApiResponse } from "next";
import { removeReaction, addReaction, getReactions } from "../../lib/reaction";

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;
  // DELETE REACTION
  if (req.method === "POST" && req.body?.type == "REMOVE") {
    try {
      const data = {
        react: req.body.react,
        ip: ip,
        page: req.body.page,
      };
      return res.status(200).json(await removeReaction(data));
    } catch (err) {
      return res.status(500).json({
        error: {
          code: 500,
          message: err,
        },
      });
    }
  }
  // ADD REACTION
  if (req.method === "POST" && req.body?.type == "ADD") {
    try {
      const data = {
        react: req.body.react,
        header: JSON.stringify(req.headers),
        ip: ip as string,
        page: req.body.page,
      };
      await addReaction(data);
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
  // GET REACTIONS
  if (req.method == "GET") {
    const data = await getReactions({ page: req.query.page, ip: ip });
    return res.status(200).json(data);
  }
};
export default notionAPI;
