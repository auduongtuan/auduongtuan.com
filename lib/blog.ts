import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const BLOG_DATABASE_ID = "2f048ef5fe514384a8482b011546c138";
import probe from "probe-image-size";
import fetchMeta from 'fetch-meta-tags'

export interface Post {
  id: string;
  slug: string;
  meta: {
    title: string;
    date: string;
    protected: boolean;
    tags: string[];
  }
}

function getProperty(
  page,
  prop: string,
  propType: "rich_text" | "title"
): string;
function getProperty(page, prop: string, propType: "checkbox"): boolean;
function getProperty(page, prop: string, propType: "date"): string;
function getProperty(page, prop: string, propType: "multi_select"): string[];

function getProperty(
  page,
  prop,
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
        returnValue = data[0].plain_text || '';
        break;
      case "title":
        returnValue = data[0].plain_text || '';
        break;
      case "date":
        returnValue = 'start' in data ? data.start : '';
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
export async function getPosts(preview?: boolean) {
  const response = await notion.databases.query({
    database_id: BLOG_DATABASE_ID,
    filter: {
      and: [
        {
          property: "Published",
          checkbox: {
            equals: preview ? false : true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });
  return response.results.map((page) => {
    return {
      id: page.id,
      slug: getProperty(page, "Slug", "rich_text"),
      meta: {
        title: getProperty(page, "Title", "title"),
        date: getProperty(page, "Date", "date"),
        protected: getProperty(page, "Protected", "checkbox"),
        tags: getProperty(page, "Tags", "multi_select"),
      },
    };
  });
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
  await Promise.all(results.map(async (block) => {
    if (block.type == 'image') {
      const {width, height} = await probe(block.image.file.url)
      block.image.width = width;
      block.image.height = height;
    }
    if (block.type == 'bookmark') {
      let blockInfo;
      try {
        blockInfo = await fetchMeta(block.bookmark.url);
      }
      catch(e) {
        blockInfo = {
          title: null,
          description: null
        }
      }
      block.bookmark.meta = blockInfo;
    }
    // get children
    if (block.has_children) {
      block.children = await getBlockChildren(block.id);
    }
  }));
  return results;
}

export const getPostContent = async (id: string) => {
  const results = await getBlockChildren(id);
  return results;
};
