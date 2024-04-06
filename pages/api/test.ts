import { NextApiRequest, NextApiResponse } from "next";
import { uploadFileToR2 } from "@lib/r2";
import { isDevEnvironment } from "@lib/utils";

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET" && isDevEnvironment) {
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
