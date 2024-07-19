import { isFullPage } from "@notionhq/client";
import { notion, getProperty } from "@lib/notion";

const NOW_DATABASE_ID = process.env.NOW_DATABASE_ID as string;

export type NotionNowItem = {
  title: string;
  content: string;
  link: string | undefined;
};

export async function getNotionNowItems(): Promise<NotionNowItem[]> {
  const response = await notion.databases.query({
    database_id: NOW_DATABASE_ID,
    sorts: [
      {
        timestamp: "last_edited_time",
        direction: "descending",
      },
    ],
  });

  const nowItems = await Promise.all(
    response.results.map(async (page) => {
      if (!isFullPage(page)) return undefined;
      return {
        title: getProperty(page, "Title", "title"),
        link: getProperty(page, "Link", "url"),
        content: getProperty(page, "Content", "rich_text"),
      };
    })
  );

  return nowItems.filter((page) => page) as NotionNowItem[];
}
