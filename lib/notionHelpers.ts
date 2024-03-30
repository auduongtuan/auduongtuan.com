import {
  BlockObjectResponse,
  FileBlockObjectResponse,
  ImageBlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
  VideoBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";
import probe from "probe-image-size";
import fetchMeta from "fetch-meta-tags";
import { get } from "lodash";
import cloudinary, { UploadApiResponse } from "@lib/cloudinary";
const NOTION_RICH_TEXT_LIMIT = 2000;
const limitRegex = new RegExp(`.{1,${NOTION_RICH_TEXT_LIMIT}}`, "g");
export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export type PageIcon = PageObjectResponse["icon"];

export type BlockObjectResponseWithChildren<T = BlockObjectResponse> = T & {
  children?: BlockObjectResponseWithChildren[];
};

export type MediaType = "image" | "video" | "raw";

export type NotionMedia = {
  type: MediaType;
  url: string;
  ext: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function breakRichTextChunks(longText: string): {
  type: "text";
  text: { content: string };
}[] {
  const chunks =
    longText.length > NOTION_RICH_TEXT_LIMIT
      ? longText.match(limitRegex)
      : null;
  return chunks
    ? chunks.map((part) => ({
        type: "text",
        text: {
          content: part,
        },
      }))
    : [
        {
          type: "text",
          text: {
            content: longText,
          },
        },
      ];
}

export function getProperty(
  page,
  prop: string,
  propType: "rich_text" | "title" | "select"
): string;
export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "checkbox"
): boolean;
export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "date"
): string;
export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "multi_select"
): string[];
export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "files"
): FileBlockObjectResponse[];
export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType:
    | "checkbox"
    | "date"
    | "multi_select"
    | "rich_text"
    | "title"
    | "select"
    | "files"
) {
  if (
    "properties" in page &&
    page.properties &&
    page.properties[prop] &&
    propType in page.properties[prop]
  ) {
    const data = page.properties[prop][propType];
    let returnValue;
    switch (propType) {
      case "rich_text":
        returnValue = data.map((item) => item?.plain_text || "").join("");
        break;
      case "title":
        returnValue = data.map((item) => item?.plain_text || "").join("");
        break;
      case "date":
        returnValue = "start" in data ? data?.start : "";
        break;
      case "checkbox":
        returnValue = data as boolean;
        break;
      case "multi_select":
        returnValue = data.map((option) => option.name);
        break;
      case "select":
        returnValue = "name" in data ? data?.name : "";
        break;
      case "files":
        returnValue = data;
        break;
      default:
        returnValue = data;
    }
    return returnValue;
  } else {
    return null;
  }
}

export function getFileUrl(file: FileBlockObjectResponse) {
  return get(file, "file.url") || get(file, "external.url") || "";
}

export function getUrlExtAndType(url: string): [string, MediaType] {
  const ext = url.split("?")[0].split(".").pop() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  if (isImage) return [ext, "image"];
  const isVideo = [
    "amv",
    "asf",
    "avi",
    "f4v",
    "flv",
    "gifv",
    "mkv",
    "mov",
    "mpg",
    "mpeg",
    "mpv",
    "mp4",
    "m4v",
    "qt",
    "wmv",
  ].includes(ext);
  if (isVideo) return [ext, "video"];
  return [ext, "raw"];
}

export async function getMediaFromCloudinary(
  public_id: string,
  type: MediaType,
  url: string
) {
  let info: UploadApiResponse;
  try {
    const resource = await cloudinary.api.resource(public_id, {
      resource_type: type,
    });
    console.log("resource found");
    info = resource;
  } catch (e) {
    info = await cloudinary.uploader.upload(url, {
      public_id: public_id,
      resource_type: type,
    });
  }
  return {
    url: info.url,
    type: info.resource_type as "image" | "video",
    width: info.width,
    height: info.height,
    ext: info.format,
  };
}

export async function getMediaFromBlock(
  block:
    | FileBlockObjectResponse
    | ImageBlockObjectResponse
    | VideoBlockObjectResponse
) {
  if (block.type == "image" || block.type == "video") {
    const url = getFileUrl(block[block.type]);
    const [ext, type] = getUrlExtAndType(url);
    const public_id = `block_${block.id}`;
    return await getMediaFromCloudinary(public_id, type, url);
  } else {
    throw new Error("Block is not an image, video, or file");
  }
}

export async function getMediaFromProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string
): Promise<NotionMedia[]> {
  const files = getProperty(page, prop, "files");
  const dimensions = getProperty(page, prop + " Dimensions", "rich_text");
  return Promise.all(
    files.map(async (file, i): Promise<NotionMedia> => {
      const url = getFileUrl(file);
      const [ext, type] = getUrlExtAndType(url);
      const public_id = `page_${page.id}_${prop}_${i}`;
      return await getMediaFromCloudinary(public_id, type, url);
      // let width = 0;
      // let height = 0;

      // if (dimensions) {
      //   const dim = dimensions.split("x");
      //   width = parseInt(dim[0]);
      //   height = parseInt(dim[1]);
      // } else if (type == "image") {
      //   const dim = await probe(url);
      //   width = dim.width;
      //   height = dim.height;
      // }

      // })
    })
  );
}

export const getBlockChildren = async (id: string) => {
  const baseQuery = {
    block_id: id,
    page_size: 100,
  };
  let results: any[] = [];
  let postContent = await notion.blocks.children.list(baseQuery);
  results = [...postContent.results];
  while (postContent.has_more) {
    postContent = await notion.blocks.children.list({
      ...baseQuery,
      start_cursor: postContent.next_cursor as string,
    });
    results = [...results, ...postContent.results];
  }
  // handle image size
  await Promise.all(
    results.map(async (block) => {
      if (block.type == "image") {
        // const { width, height } = await probe(block.image.file.url);
        const media = await getMediaFromBlock(block);
        block.image.url = media.url;
        block.image.width = media.width;
        block.image.height = media.height;
      }
      if (block.type == "video") {
        // const { width, height } = await probe(block.video.file.url);
        const media = await getMediaFromBlock(block);
        block.video.url = media.url;
        block.video.width = media.width;
        block.video.height = media.height;
      }
      if (block.type == "bookmark") {
        let blockInfo;
        try {
          blockInfo = await fetchMeta(block.bookmark.url);
        } catch (e) {
          blockInfo = {
            title: null,
            description: null,
          };
        }
        block.bookmark.meta = blockInfo;
      }
      // get children
      if (block.has_children) {
        block.children = await getBlockChildren(block.id);
      }
    })
  );
  return results;
};

export function getPageFileUrl(
  pageId: string,
  prop: string,
  order: number = 0
) {
  return (
    `/api/notion-asset/page/${pageId}/${prop}` + (order ? `/${order}` : "")
  );
}

export function getBlockFileUrl(blockId: string) {
  return `/api/notion-asset/block/${blockId}`;
}

export function getPageIcon(page: PageObjectResponse) {
  if (page?.icon?.type == "file") {
    return {
      url: getPageFileUrl(page.id, "icon"),
      width: 40,
      height: 40,
    };
  }
  return null;
}
