import * as https from "https";
const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "public, s-maxage=59, stale-while-rgevalidate";
import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const getNotionAsset = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assetRequest, last_edited_time } = req.query;
  // console.log(assetRequest);
  if (assetRequest && assetRequest.length > 0) {
    const block = await notion.blocks.retrieve({
      block_id: assetRequest[0],
    });

    return new Promise<void>((resolve, reject) => {
      if (
        block &&
        "type" in block &&
        (block.type == "image" || block.type == "video") &&
        "file" in block[block.type]
      ) {
        // res.end(block.image.file.url);
        https.get(block[block.type].file.url, (getResponse) => {
          const proxyHeader = (header: string) => {
            const value =
              getResponse.headers[header] ||
              getResponse.headers[header.toLowerCase()];
            if (value) {
              res.setHeader(header, value);
            }
          };

          proxyHeader("Content-Type");
          proxyHeader("Content-Length");

          if (getResponse.statusCode === 200) {
            res.setHeader("Cache-Control", IMMUTABLE);
            res.writeHead(200, "OK");
          } else {
            res.status(getResponse.statusCode || 500);
          }

          getResponse
            .pipe(res)
            .on("end", () => {
              res.end();
              resolve();
            })
            .on("error", (err) => {
              console.log("Pipe error", err);
              res.writeHead(500, err.toString());
              res.end();
              reject(err);
            });
        });
      } else {
        res.status(400).end();
        reject();
      }
    });
  }

  // const assetRequest = parseAssetRequestQuery(req.query as any);
  // const isVercel = Boolean(
  //   process.env.VERCEL ||
  //     process.env.AWS_LAMBDA_FUNCTION_NAME ||
  //     process.env.VERCEL_ANALYTICS_ID
  // );
  // const isCI = Boolean(process.env.CI);
  // console.log("Asset request handler", assetRequest, "meta:", {
  //   isVercel,
  //   isCI,
  // });
  // if (isVercel && !isCI) {
  //   // On Vercel, filesystem is read-only.
  //   await getNotionAssetUsingNetwork(req, res, assetRequest);
  // } else {
  //   await getNotionAssetUsingDisk(req, res, assetRequest);
  // }
};
// function getSuccessCacheControlHeader(assetRequest) {
//   if (assetRequest.last_edited_time) {
//     return IMMUTABLE;
//   } else {
//     return REVALIDATE;
//   }
// }
export default getNotionAsset;
