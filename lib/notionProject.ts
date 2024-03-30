import { isFullPage } from "@notionhq/client";
import {
  notion,
  getProperty,
  getBlockChildren,
  PageIcon,
  getPageIcon,
  NotionMedia,
  getMediaFromProperty,
} from "./notionHelpers";
const PROJECT_DATABASE_ID = process.env.PROJECT_DATABASE_ID as string;
import probe from "probe-image-size";

export type NotionProject = {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: "web" | "app" | "other";
  description?: string;
  tagline?: string;
  meta: {
    background?: string;
    contentBackground?: string;
    cover?: NotionMedia[];
    tools?: string[];
    roles?: string[];
    achievements?: string[];
    team?: string[];
    link?: string;
    linkCta?: string;
    browser?: boolean;
    half?: boolean;
    point?: number;
    protected?: boolean;
    [key: string]: unknown;
  };
};

export async function getNotionProjects(
  includeUnpublished?: boolean
): Promise<NotionProject[]> {
  let filterQuery: any = {
    and: [
      {
        property: "Slug",
        rich_text: {
          is_not_empty: true,
        },
      },
      {
        property: "Date",
        date: {
          is_not_empty: true,
        },
      },
    ],
  };
  if (!includeUnpublished) {
    filterQuery.and.push({
      property: "Published",
      checkbox: {
        equals: true,
      },
    });
  }
  const response = await notion.databases.query({
    database_id: PROJECT_DATABASE_ID,
    filter: filterQuery,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const projects = await Promise.all(
    response.results.map(async (page) => {
      if (!isFullPage(page)) return undefined;
      return {
        id: page.id,
        slug: getProperty(page, "Slug", "rich_text"),
        title: getProperty(page, "Title", "title"),
        date: getProperty(page, "Date", "date"),
        description: getProperty(page, "Description", "rich_text"),
        type: getProperty(page, "Type", "select"),
        tagline: getProperty(page, "Tagline", "rich_text"),
        meta: {
          icon: getPageIcon(page),
          tools: getProperty(page, "Tools", "multi_select"),
          roles: getProperty(page, "Roles", "multi_select"),
          cover: await getMediaFromProperty(page, "Cover"),
        },
      };
    })
  );
  return projects.filter((page) => page) as NotionProject[];
}
