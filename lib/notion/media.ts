import cloudinary, { UploadApiResponse } from "@lib/cloudinary";
import { getProperty } from "@lib/notion";
import {
  FileBlockObjectResponse,
  ImageBlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
  VideoBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { get } from "lodash";

export type PageIcon = PageObjectResponse["icon"];

export type MediaType = "image" | "video" | "raw";

export type NotionMedia = {
  type: MediaType;
  url: string;
  ext: string;
  caption?: string;
  width?: number;
  height?: number;
  lastUpdated?: string;
};

export type NotionAssets = {
  [key: string]: NotionMedia | NotionMedia[];
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

export async function getPageIcon(page: PageObjectResponse) {
  if (page.icon?.type == "file") {
    return await getMediaFromCloudinary(
      `page_${page.id}_icon`,
      "image",
      page.icon.file.url
    );
  }
  return null;
}

export function getFileUrl(file: FileBlockObjectResponse) {
  return get(file, "file.url") || get(file, "external.url") || "";
}

export function getExtFromUrl(url: string): string {
  try {
    const ext = (url && url.split("?")[0].split(".").pop()) || "";
    return ext;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getTypeFromExt(ext: string): MediaType {
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  if (isImage) return "image";
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
  if (isVideo) return "video";
  return "raw";
}

export function getTypeFromUrl(url: string): MediaType {
  const ext = getExtFromUrl(url);
  return getTypeFromExt(ext);
}

export async function getMediaFromCloudinary(
  public_id: string,
  type: MediaType,
  url: string,
  renew: boolean | string = false
) {
  let info: UploadApiResponse;
  const newUpload = async () => {
    return await cloudinary.uploader.upload(url, {
      public_id: public_id,
      resource_type: type,
      timeout: 60000,
    });
  };

  if (renew === true) {
    info = await newUpload();
  } else {
    try {
      const resource = await cloudinary.api.resource(public_id, {
        resource_type: type,
        timeout: 60000,
      });
      info = resource;
      if (typeof renew === "string") {
        if (new Date(resource.last_updated.updated_at) < new Date(renew)) {
          info = await newUpload();
        }
      }
    } catch (e) {
      info = await newUpload();
    }
  }
  return {
    url: info.secure_url,
    type: info.resource_type as "image" | "video",
    width: info.width,
    height: info.height,
    ext: info.format,
    lastUpdated: info.last_updated
      ? info.last_updated.updated_at
      : info.created_at,
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
    const type = getTypeFromUrl(url);
    const public_id = `block_${block.id}`;
    if (!url) {
      throw new Error("Block does not have a file URL");
    }
    return await getMediaFromCloudinary(
      public_id,
      type,
      url,
      block.last_edited_time
    );
  } else {
    throw new Error("Block is not an image, video, or file");
  }
}

export async function getMediaFromProperty(
  page: PageObjectResponse,
  prop: string
): Promise<NotionMedia[]> {
  const files = getProperty(page, prop, "files");
  // const dimensions = getProperty(page, prop + " Dimensions", "rich_text");
  return Promise.all(
    files.map(async (file, i): Promise<NotionMedia> => {
      const url = getFileUrl(file);
      const type = getTypeFromUrl(url);
      const public_id = `page_${page.id}_${prop}_${i}`;
      return await getMediaFromCloudinary(
        public_id,
        type,
        url,
        page.last_edited_time
      );
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
