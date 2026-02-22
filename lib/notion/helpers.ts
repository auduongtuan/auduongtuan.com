import {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  FileBlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import fetchMeta from "fetch-meta-tags";
import { NOTION_RICH_TEXT_LIMIT, notion } from "./base";
import { NotionMedia, NotionAssets, getMediaFromBlock } from "./media";

// Metadata types for blocks enhanced by our code
export type BlockMeta = {
  url: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
};

// Enhanced bookmark block with metadata
export type EnhancedBookmarkBlock = BookmarkBlockObjectResponse & {
  bookmark: BookmarkBlockObjectResponse["bookmark"] & {
    meta?: BlockMeta;
  };
};

// Union type for all enhanced blocks
export type EnhancedBlockObjectResponse =
  | EnhancedBookmarkBlock
  | Exclude<BlockObjectResponse, BookmarkBlockObjectResponse>;

const limitRegex = new RegExp(`.{1,${NOTION_RICH_TEXT_LIMIT}}`, "g");

export type BlockObjectResponseWithChildren<T = BlockObjectResponse> = T & {
  children?: BlockObjectResponseWithChildren[];
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
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "rich_text" | "title",
  plain: false,
): RichTextItemResponse[];

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "rich_text" | "title",
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "rich_text" | "title",
  plain: true,
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "select",
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "number",
): number;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "checkbox",
): boolean;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "url",
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "date",
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "multi_select",
): string[];

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "files",
): FileBlockObjectResponse[];

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "relation",
): string[];

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "last_edited_time" | "created_time",
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType:
    | "checkbox"
    | "date"
    | "last_edited_time"
    | "created_time"
    | "multi_select"
    | "rich_text"
    | "title"
    | "select"
    | "files"
    | "url"
    | "number"
    | "relation",

  plain: boolean = true,
) {
  if (
    "properties" in page &&
    page.properties &&
    page.properties[prop] &&
    propType in page.properties[prop]
  ) {
    const data = page.properties[prop][propType];
    let returnValue: any;
    switch (propType) {
      case "rich_text":
        if (!plain) {
          returnValue = data;
          break;
        }
        returnValue = data.map((item) => item?.plain_text || "").join("");
        break;
      case "title":
        returnValue = data.map((item) => item?.plain_text || "").join("");
        break;
      case "date":
        returnValue = data && "start" in data ? data?.start : undefined;
        break;
      case "last_edited_time":
        returnValue = data;
        break;
      case "created_time":
        returnValue = data;
        break;
      case "checkbox":
        returnValue = data as boolean;
        break;
      case "multi_select":
        returnValue = data.map((option) => option.name);
        break;
      case "select":
        returnValue = data && "name" in data ? data?.name : undefined;
        break;
      case "files":
        returnValue = data;
        break;
      case "relation":
        returnValue = data.map((item) => item.id);
        break;
      default:
        returnValue = data;
    }
    return returnValue;
  } else {
    // Return empty array for multi_select when property doesn't exist
    if (propType === "multi_select" || propType === "relation") {
      return [];
    }
    return undefined;
  }
}

export async function getBlockChildren(
  block_id: string,
  assets?: NotionAssets,
): Promise<EnhancedBlockObjectResponse[]> {
  const blocks: EnhancedBlockObjectResponse[] = [];
  const currentAssets: NotionAssets = assets || {};

  const baseQuery = {
    block_id: block_id,
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
      if (block.type == "image" || block.type == "video") {
        // const { width, height } = await probe(block.video.file.url);
        let media: NotionMedia | undefined = undefined;
        const assetValue = currentAssets[block.id];
        if (block.id in currentAssets && !Array.isArray(assetValue)) {
          media = assetValue;
        }
        // renew media if it's not there or outdated
        if (
          !media ||
          !media.lastUpdated ||
          new Date(media.lastUpdated) < new Date(block.last_edited_time)
        ) {
          media = await getMediaFromBlock(block);
          currentAssets[block.id] = media;
        }
        block[block.type].url = media.url;
        block[block.type].width = media.width || null;
        block[block.type].height = media.height || null;
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
        block.children = await getBlockChildren(block.id, assets);
      }
    }),
  );
  return results;
}
