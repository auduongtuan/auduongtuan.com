import {
  getNotionPageContent,
  getProperty,
  notion,
  NotionAssets,
  NotionMedia,
  parseNotionPageAssets,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";
import { cache, shouldRevalidateCache } from "@lib/utils/cache";
import { isFullPage } from "@notionhq/client";

const PROJECT_DATASOURCE_ID = process.env.PROJECT_DATASOURCE_ID as string;
const PROJECT_GROUP_DATASOURCE_ID = process.env
  .PROJECT_GROUP_DATASOURCE_ID as string;

export type ProjectGroup = {
  id: string;
  name: string;
  description: string;
  order: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  caseStudy: boolean;
  type: string[];
  description: string;
  tagline: string;
  point: number;
  cover: NotionMedia[];
  icon?: NotionMedia;
  tools: string[];
  roles: string[];
  protected: boolean;
  achievements?: string[];
  background?: string;
  tags: string[];
  team: string[];
  link?: string;
  linkCta?: string;
  group?: ProjectGroup;
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
    const forceRevalidate = shouldRevalidateCache();
    const cacheData = !forceRevalidate
      ? (cache.get("projects") as Project[])
      : null;
    if (cacheData) {
      projects = cacheData;
    } else {
      projects = await getProjects(isDevEnvironment);
      cache.set("projects", projects, 24 * 1000 * 60 * 60);
      if (forceRevalidate) {
        console.log("🔄 Cache revalidated for projects");
      }
    }
  } else {
    projects = await getProjects(isDevEnvironment);
  }
  return projects;
}

export async function getProjectGroups(): Promise<ProjectGroup[]> {
  const projectGroupResponse = await notion.dataSources.query({
    data_source_id: PROJECT_GROUP_DATASOURCE_ID,
    sorts: [
      {
        property: "Order",
        direction: "descending",
      },
    ],
  });
  const projectGroups = (await Promise.all(
    projectGroupResponse.results
      .map(async (page) => {
        if (!isFullPage(page)) return undefined;
        return {
          id: page.id,
          name: getProperty(page, "Name", "title"),
          description: getProperty(page, "Description", "rich_text"),
          order: getProperty(page, "Order", "number") || 0,
        };
      })
      .filter((page) => typeof page != "undefined"),
  )) as ProjectGroup[];
  return projectGroups;
}

export async function getProjects(
  includeUnpublished?: boolean,
): Promise<Project[]> {
  let filterQuery: any = {
    and: [
      // {
      //   property: "Slug",
      //   rich_text: {
      //     is_not_empty: true,
      //   },
      // },
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
  const projectGroups = await getProjectGroups();
  const projectResponse = await notion.dataSources.query({
    data_source_id: PROJECT_DATASOURCE_ID,
    filter: filterQuery,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const projects = await Promise.all(
    projectResponse.results.map(async (page) => {
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
      const groupId = getProperty(page, "Group", "relation")[0];

      return {
        id: page.id,
        slug: getProperty(page, "Slug", "rich_text"),
        title: getProperty(page, "Title", "title"),
        date: getProperty(page, "Date", "date"),
        description: getProperty(page, "Description", "rich_text"),
        type: getProperty(page, "Type", "multi_select"),
        tagline: getProperty(page, "Tagline", "rich_text"),
        caseStudy: getProperty(page, "Case Study", "checkbox"),
        cover: assets.cover,
        icon: assets.icon,
        tools: getProperty(page, "Tools", "multi_select"),
        team: getProperty(page, "Team", "multi_select"),
        link: getProperty(page, "Link", "url"),
        roles: getProperty(page, "Roles", "multi_select"),
        tags: getProperty(page, "Tags", "multi_select"),
        achievements,
        point: getProperty(page, "Point", "number"),
        background: getProperty(page, "Background", "rich_text"),
        protected: getProperty(page, "Protected", "checkbox"),
        points: {
          engineering: getProperty(page, "Engineering Point", "number") || 0,
          product: getProperty(page, "Product Point", "number") || 0,
          visual: getProperty(page, "Visual Point", "number") || 0,
        },
        assets: assets,
        coverTitle: getProperty(page, "Cover Title", "rich_text"),
        passwordId: getProperty(page, "Password", "relation")[0] || null,
        group: groupId
          ? projectGroups.find((group) => group.id == groupId)
          : undefined,
      };
    }),
  );

  const filteredProjects = projects.filter((page) => page) as Project[];

  // Remove undefined values for JSON serialization
  const cleanProjects = filteredProjects.map((project) =>
    Object.fromEntries(
      Object.entries(project).filter(([_, value]) => value !== undefined),
    ),
  ) as Project[];

  return cleanProjects;
}

export const getProjectContent = async (id: string) => {
  return await getNotionPageContent(id);
};
