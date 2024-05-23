import { isFullPage } from "@notionhq/client";
import {
  notion,
  getProperty,
  getPageIcon,
  NotionMedia,
  getMediaFromProperty,
  getBlockChildren,
  NotionAssets,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";
import cacheData from "memory-cache";

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
  group?: string;
  points: {
    engineering: number;
    product: number;
    visual: number;
  };
  assets: NotionAssets;
  coverTitle?: string;
  // [key: string]: unknown;
};

export async function getNotionProjectsWithCache() {
  let projects: NotionProject[];
  if (isDevEnvironment) {
    const cache = cacheData.get("projects");
    if (cache) {
      projects = cache;
    } else {
      projects = await getNotionProjects(isDevEnvironment);
      cacheData.put("projects", projects, 24 * 1000 * 60 * 60);
    }
  } else {
    projects = await getNotionProjects(isDevEnvironment);
  }
  return projects;
}

export async function updateNotionAssets(assets: any, pageId: string) {
  let json = JSON.stringify(assets);
  let chunks: string[] = [];
  for (var i = 0, charsLength = json.length; i < charsLength; i += 2000) {
    chunks.push(json.substring(i, i + 2000));
  }
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Assets: {
        rich_text: chunks.map((chunk) => ({
          type: "text",
          text: { content: chunk },
        })),
      },
    },
  });
}

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
      const assetsJson = getProperty(page, "Assets", "rich_text") || "{}";
      const assets = JSON.parse(assetsJson);

      let update: boolean = false;
      if (!("cover" in assets)) {
        assets.cover = await getMediaFromProperty(page, "Cover");
        update = true;
      }
      if (!("icon" in assets) || !assets.icon) {
        assets.icon = await getPageIcon(page);
        update = true;
      }
      if (update) {
        await updateNotionAssets(assets, page.id);
      }
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
        halfDisplay: getProperty(page, "Half Display", "checkbox"),
        point: getProperty(page, "Point", "number"),
        background: getProperty(page, "Background", "rich_text"),
        protected: getProperty(page, "Protected", "checkbox"),
        postSlug: getProperty(page, "Post Slug", "rich_text"),
        group: getProperty(page, "Group", "select"),
        points: {
          engineering: getProperty(page, "Engineering Point", "number") || 0,
          product: getProperty(page, "Product Point", "number") || 0,
          visual: getProperty(page, "Visual Point", "number") || 0,
        },
        assets: assets,
        coverTitle: getProperty(page, "Cover Title", "rich_text"),
      };
    })
  );

  return projects.filter((page) => page) as NotionProject[];
}

export const getNotionProjectContent = async (id: string) => {
  const page = await notion.pages.retrieve({
    page_id: id,
  });
  const assetsJson = getProperty(page, "Assets", "rich_text") || "{}";
  const assets = JSON.parse(assetsJson);
  const results = await getBlockChildren(id, assets);
  await updateNotionAssets(assets, id);
  return results;
};
