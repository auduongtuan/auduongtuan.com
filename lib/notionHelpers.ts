import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";
import probe from "probe-image-size";
import fetchMeta from "fetch-meta-tags";
const NOTION_RICH_TEXT_LIMIT = 2000;
const limitRegex = new RegExp(`.{1,${NOTION_RICH_TEXT_LIMIT}}`, "g");
export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export type PageIcon = PageObjectResponse["icon"];
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
  propType: "rich_text" | "title"
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
  propType: "checkbox" | "date" | "multi_select" | "rich_text" | "title"
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
    }
    return returnValue;
  } else {
    return null;
  }
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
        const { width, height } = await probe(block.image.file.url);
        block.image.width = width;
        block.image.height = height;
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
