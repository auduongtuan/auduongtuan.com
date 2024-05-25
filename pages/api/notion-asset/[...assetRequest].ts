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
          proxyHeader("Range");
          proxyHeader("Accept-Ranges");
          proxyHeader("Access-Control-Allow-Origin");
          proxyHeader("ETag");

          if (getResponse.headers["content-type"] == "video/mp4") {
            // console.log("serve video file");
            const options: { start?: number; end?: number } = {};

            let start: number | undefined = undefined;
            let end: number | undefined = undefined;

            const range = req.headers.range;
            if (range) {
              const bytesPrefix = "bytes=";
              if (range.startsWith(bytesPrefix)) {
                const bytesRange = range.substring(bytesPrefix.length);
                const parts = bytesRange.split("-");
                if (parts.length === 2) {
                  const rangeStart = parts[0] && parts[0].trim();
                  if (rangeStart && rangeStart.length > 0) {
                    options.start = start = parseInt(rangeStart);
                  }
                  const rangeEnd = parts[1] && parts[1].trim();
                  if (rangeEnd && rangeEnd.length > 0) {
                    options.end = end = parseInt(rangeEnd);
                  }
                }
              }
            }
            let contentLength = parseInt(
              getResponse.headers["content-length"] || ""
            );

            // Listing 4.
            if (req.method === "HEAD") {
              res.statusCode = 200;
              res.setHeader("accept-ranges", "bytes");
              res.setHeader("content-length", contentLength);
              res.end();
            } else {
              // Listing 5.
              let retrievedLength: number;
              if (start !== undefined && end !== undefined) {
                retrievedLength = end + 1 - start;
              } else if (start !== undefined) {
                retrievedLength = contentLength - start;
              } else if (end !== undefined) {
                retrievedLength = end + 1;
              } else {
                retrievedLength = contentLength;
              }

              // Listing 6.
              res.statusCode =
                start !== undefined || end !== undefined ? 206 : 200;
              if (res.statusCode == 200)
                res.setHeader("Cache-Control", IMMUTABLE);
              res.setHeader("content-length", retrievedLength);

              if (range !== undefined) {
                res.setHeader(
                  "content-range",
                  `bytes ${start || 0}-${
                    end || contentLength - 1
                  }/${contentLength}`
                );
                res.setHeader("accept-ranges", "bytes");
              }
              getResponse
                .pipe(res)
                .on("end", () => {
                  res.end();
                  resolve();
                })
                .on("error", (err) => {
                  // console.log("Pipe error", err);
                  res.writeHead(500, err.toString());
                  res.end();
                  reject(err);
                });
              // // Listing 7.
              // const fileStream = fs.createReadStream(filePath, options);
              // fileStream.on("error", (error) => {
              //   console.log(`Error reading file ${filePath}.`);
              //   console.log(error);
              //   res.sendStatus(500);
              // });

              // fileStream.pipe(res);
            }
          } else {
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
                // console.log("Pipe error", err);
                res.writeHead(500, err.toString());
                res.end();
                reject(err);
              });
          }
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
