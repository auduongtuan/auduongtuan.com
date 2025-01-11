// simple tracking system
import { NextApiRequest, NextApiResponse } from "next";
import { createTracking } from "@lib/notion/tracking";

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create comment
  if (req.method === "POST") {
    try {
      const data = {
        event: req.body.event,
        content: req.body.content || "",
        page: req.body.page || "",
        header: JSON.stringify(req.headers),
      };
      await createTracking(data);
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
  } else {
    return res.status(404).json({
      error: {
        code: 404,
        message: "Not found",
      },
    });
  }
};

export default notionAPI;
