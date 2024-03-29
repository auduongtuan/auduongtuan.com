import fs from "fs";
import path, { join } from "path";
import matter from "gray-matter";
import {
  notion,
  getProperty,
  getBlockChildren,
  PageIcon,
} from "./notionHelpers";

export const PROJECTS_PATH = path.join(process.cwd(), "content/projects");
const PROJECT_DATABASE_ID = process.env.PROJECT_DATABASE_ID as string;

type NotionMedia = {
  type: "image" | "video";
  url: string;
  caption?: string;
  width?: number;
  height?: number;
};
export type NotionProject = {
  slug: string;
  meta: {
    title: string;
    date: string;
    type: "casestudy" | "link" | "private" | "post";
    background?: string;
    contentBackground?: string;
    description?: string;
    tagline?: string;
    cover1?: string;
    cover2?: string;
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
  };
};
export type Project = {
  slug: string;
  meta: {
    title: string;
    date: string;
    type: "casestudy" | "link" | "private" | "post";
    background?: string;
    contentBackground?: string;
    description?: string;
    tagline?: string;
    cover1?: string;
    cover2?: string;
    tools?: string[];
    roles?: string[];
    achievements?: string[];
    team?: string[];
    link?: string;
    linkCta?: string;
    postSlug?: string;
    browser?: boolean;
    half?: boolean;
    coverHeight?: number;
    coverWidth?: number;
    videoWidth?: number;
    videoHeight?: number;
    coolness?: number;
    protected?: boolean;
    [key: string]: any;
  };
  content: string;
  parsedContent?: any;
};

export const projectSlugs = fs
  .readdirSync(PROJECTS_PATH)
  .filter((fn) => fn.endsWith(".mdx"))
  .map((fileName) => fileName.replace(/\.mdx$/, ""));

export const getProject = (slug: string): Project | null => {
  const fullPath = join(PROJECTS_PATH, `${slug}.mdx`);
  try {
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const { content, data }: { content: any; data: { [key: string]: any } } =
        matter(fileContents);

      // Combine the data with the id
      return {
        slug: slug,
        meta: data as Project["meta"],
        content: content,
      };
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const allProjects: Project[] = projectSlugs.reduce(
  (projects: Project[], slug) => {
    const fullPath = join(PROJECTS_PATH, `${slug}.mdx`);
    // Read markdown file as string
    try {
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const {
          content,
          data,
        }: { content: any; data: { [key: string]: any } } =
          matter(fileContents);

        // Combine the data with the id
        projects.push({
          slug: slug,
          meta: data as Project["meta"],
          content: content,
        });
      }
    } catch (err) {
      console.log(err);
    }
    return projects;
  },
  []
);

export async function getNotionProjects(includeUnpublished?: boolean) {
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

  return response.results.map((page) => {
    const covers = getProperty(page, "Cover", "files").map((file) => {
      return {
        file,
      };
    });
    return {
      id: page.id,
      slug: getProperty(page, "Slug", "rich_text"),
      meta: {
        icon: "icon" in page ? page?.icon : null,
        title: getProperty(page, "Title", "title"),
        type: getProperty(page, "Type", "select"),
        date: getProperty(page, "Date", "date"),
        tools: getProperty(page, "Tools", "multi_select"),
        roles: getProperty(page, "Roles", "multi_select"),
        description: getProperty(page, "Description", "rich_text"),
        cover: getProperty(page, "Cover", "files"),
      },
    };
  });
}
export default allProjects;

// export function getProjectSlugs(): string[] {
//     return fs.readdirSync(PROJECTS_PATH).filter(fn => fn.endsWith('.mdx')).map(fileName => fileName.replace(/\.mdx$/, ''));
//     // return fs.readdirSync(PROJECTS_PATH, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
// }
// export async function getProjectBySlug(slug: string): Promise<Project|null|undefined> {
//     // Remove ".mdx" from file name to get id
//     const fullPath = join(PROJECTS_PATH, `${slug}.mdx`);

//     // Read markdown file as string
//     try {
//         if (fs.existsSync(fullPath)) {
//             const fileContents = fs.readFileSync(fullPath, 'utf8')

//             // Use gray-matter to parse the post metadata section
//             const {content, data}:{content: any, data: {[key:string]: any}} = matter(fileContents)

//             // Combine the data with the id
//             return {
//                 slug: slug,
//                 meta: data as Project["meta"],
//                 content: content
//             }
//         }
//     } catch(err) {
//         return null;
//     }

// }
// export async function getAllProjects() {
//     return await Promise.all(getProjectSlugs().map(async slug => {
//         return await getProjectBySlug(slug);
//     }));
// }
