import {
  BlockObjectResponse,
  FileBlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import fetchMeta from "fetch-meta-tags";
import { NOTION_RICH_TEXT_LIMIT, notion } from "./base";
import { NotionMedia, getMediaFromBlock } from "./media";

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
  propType: "rich_text" | "title" | "select"
): string;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "number"
): number;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "checkbox"
): boolean;

export function getProperty(
  page: PageObjectResponse | PartialPageObjectResponse,
  prop: string,
  propType: "url"
): string;

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
    | "url"
    | "number"
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

export const getBlockChildren = async (
  id: string,
  assets: { [key: string]: NotionMedia } = {}
) => {
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
      if (block.type == "image" || block.type == "video") {
        // const { width, height } = await probe(block.video.file.url);
        let media: NotionMedia | undefined = undefined;
        if (block.id in assets) media = assets[block.id];
        // renew media if it's not there or outdated
        if (
          !media ||
          !media.lastUpdated ||
          new Date(media.lastUpdated) < new Date(block.last_edited_time)
        ) {
          media = await getMediaFromBlock(block);
          assets[block.id] = media;
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
    })
  );
  return results;
};
