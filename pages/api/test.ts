import { NextApiRequest, NextApiResponse } from "next";
import { createComment, getComments } from "@lib/comment";
import { uploadFileToR2 } from "@lib/r2";
const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(
        await uploadFileToR2(
          "test",
          "https://auduongtuan.com/uploads/eware/eware2.png"
        )
      );
  }
};
export default notionAPI;
