import { isFullPage } from "@notionhq/client";
import {
  notion,
  getProperty,
  getPageIcon,
  NotionMedia,
  getMediaFromProperty,
  getBlockChildren,
} from "@lib/notion";

const PROJECT_DATABASE_ID = process.env.PROJECT_DATABASE_ID as string;

export type NotionProject = {
  id: string;
  slug: string;
  title: string;
  date: string;
  caseStudy: boolean;
  platform: "web" | "app" | "other";
  description: string;
  tagline: string;
  point: number;
  cover: NotionMedia[];
  icon: NotionMedia;
  tools: string[];
  roles: string[];
  protected: boolean;
  halfDisplay: boolean;
  achievements?: string[];
  background?: string;
  team?: string[];
  link?: string;
  linkCta?: string;
  postSlug?: string;
  // [key: string]: unknown;
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
        platform: getProperty(page, "Platform", "select"),
        tagline: getProperty(page, "Tagline", "rich_text"),
        caseStudy: getProperty(page, "Case Study", "checkbox"),
        cover: await getMediaFromProperty(page, "Cover"),
        icon: await getPageIcon(page),
        tools: getProperty(page, "Tools", "multi_select"),
        team: getProperty(page, "Team", "multi_select"),
        link: getProperty(page, "Link", "url"),
        roles: getProperty(page, "Roles", "multi_select"),
        achievements: getProperty(page, "Achievements", "rich_text")
          .split(",")
          .map((item) => item.trim())
          .filter((achievement) => achievement),
        halfDisplay: getProperty(page, "Half Display", "checkbox"),
        point: getProperty(page, "Point", "number"),
        background: getProperty(page, "Background", "rich_text"),
        protected: getProperty(page, "Protected", "checkbox"),
        postSlug: getProperty(page, "Post Slug", "rich_text"),
      };
    })
  );

  return projects.filter((page) => page) as NotionProject[];
}

export const getNotionProjectContent = async (id: string) => {
  const results = await getBlockChildren(id);
  return results;
};
