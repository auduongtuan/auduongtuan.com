import * as https from "https";
const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "public, s-maxage=59, stale-while-rgevalidate";
import { Client, isFullPage } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const getNotionAsset = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assetRequest, last_edited_time } = req.query;
  // console.log(assetRequest);
  if (assetRequest && assetRequest.length > 0) {
    const assetReq = [...assetRequest];
    //remove file extension if present
    assetReq[assetReq.length - 1] = assetReq[assetReq.length - 1].replace(
      /\.[^/.]+$/,
      ""
    );
    const [type, id, property, index = 0] = assetReq;
    let fileUrl: string;

    if (type == "page") {
      const page = await notion.pages.retrieve({
        page_id: id,
      });
      if (
        isFullPage(page) &&
        property == "icon" &&
        page.icon &&
        "file" in page.icon
      )
        fileUrl = page.icon?.file?.url;
      if (isFullPage(page) && property in page.properties) {
        const prop = page.properties[property];
        if (
          prop.type == "files" &&
          "files" in prop &&
          prop.files[index] &&
          "file" in prop.files[index]
        ) {
          fileUrl = prop.files[index]?.file?.url;
        }
      }
    } else if (type == "block") {
      const block = await notion.blocks.retrieve({
        block_id: id,
      });
      if (
        block &&
        "type" in block &&
        (block.type == "image" || block.type == "video") &&
        "file" in block[block.type]
      )
        fileUrl = block[block.type].file.url;
    }

    return new Promise<void>((resolve, reject) => {
      if (fileUrl) {
        // res.end(block.image.file.url);
        https.get(fileUrl, (getResponse) => {
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
