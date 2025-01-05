import { isFullPage } from "@notionhq/client";
import {
  notion,
  getProperty,
  NotionMedia,
  NotionAssets,
  parseNotionPageAssets,
  getNotionPageContent,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";
import cacheData from "memory-cache";

const PROJECT_DATABASE_ID = process.env.PROJECT_DATABASE_ID as string;

export type Project = {
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
  achievements?: string[];
  background?: string;
  team?: string[];
  link?: string;
  linkCta?: string;
  postSlug?: string;
  group?: string;
  points: {
    engineering: number;
    product: number;
    visual: number;
  };
  assets: NotionAssets;
  coverTitle?: string;
  passwordId?: string;
  // [key: string]: unknown;
};

export async function getProjectsWithCache() {
  let projects: Project[];
  if (isDevEnvironment) {
    const cache = cacheData.get("projects");
    if (cache) {
      projects = cache;
    } else {
      projects = await getProjects(isDevEnvironment);
      cacheData.put("projects", projects, 24 * 1000 * 60 * 60);
    }
  } else {
    projects = await getProjects(isDevEnvironment);
  }
  return projects;
}

export async function getProjects(
  includeUnpublished?: boolean
): Promise<Project[]> {
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
      const assets = await parseNotionPageAssets(page);
      const achievementsText = getProperty(page, "Achievements", "rich_text");
      const achievements =
        achievementsText && achievementsText.length > 0
          ? achievementsText
              .split(",")
              .map((item) => item.trim())
              .filter((achievement) => achievement)
          : [];

      return {
        id: page.id,
        slug: getProperty(page, "Slug", "rich_text"),
        title: getProperty(page, "Title", "title"),
        date: getProperty(page, "Date", "date"),
        description: getProperty(page, "Description", "rich_text"),
        platform: getProperty(page, "Platform", "select"),
        tagline: getProperty(page, "Tagline", "rich_text"),
        caseStudy: getProperty(page, "Case Study", "checkbox"),
        cover: assets.cover,
        icon: assets.icon,
        tools: getProperty(page, "Tools", "multi_select"),
        team: getProperty(page, "Team", "multi_select"),
        link: getProperty(page, "Link", "url"),
        roles: getProperty(page, "Roles", "multi_select"),
        achievements,
        point: getProperty(page, "Point", "number"),
        background: getProperty(page, "Background", "rich_text"),
        protected: getProperty(page, "Protected", "checkbox"),
        group: getProperty(page, "Group", "select"),
        points: {
          engineering: getProperty(page, "Engineering Point", "number") || 0,
          product: getProperty(page, "Product Point", "number") || 0,
          visual: getProperty(page, "Visual Point", "number") || 0,
        },
        assets: assets,
        coverTitle: getProperty(page, "Cover Title", "rich_text"),
        passwordId: getProperty(page, "Password", "relation")[0] || null,
      };
    })
  );

  return projects.filter((page) => page) as Project[];
}

export const getProjectContent = async (id: string) => {
  return await getNotionPageContent(id);
};
