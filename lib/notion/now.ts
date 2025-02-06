import { getProperty, notion } from "@lib/notion";
import { isFullPage } from "@notionhq/client";
import { getThumbnailFromUrl } from "@lib/thumbnail";

const NOW_DATABASE_ID = process.env.NOW_DATABASE_ID as string;

export type NotionNowItem = {
  title: string;
  content: string;
  link: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  } | null;
  archived: boolean;
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
      const link = getProperty(page, "Link", "url");
      const thumbnail = await getThumbnailFromUrl(link);
      return {
        title: getProperty(page, "Title", "title"),
        link: getProperty(page, "Link", "url"),
        content: getProperty(page, "Content", "rich_text"),
        thumbnail: thumbnail || null,
        archived: getProperty(page, "Archived", "checkbox") || false,
      };
    }),
  );

  return nowItems.filter((page) => page) as NotionNowItem[];
}
