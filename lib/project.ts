import fs from "fs";
import path, { join } from "path";
import matter from "gray-matter";

export const PROJECTS_PATH = path.join(process.cwd(), "content/projects");

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

// export const allProjects: Project[] = projectSlugs.reduce(
//   (projects: Project[], slug) => {
//     const fullPath = join(PROJECTS_PATH, `${slug}.mdx`);
//     // Read markdown file as string
//     try {
//       if (fs.existsSync(fullPath)) {
//         const fileContents = fs.readFileSync(fullPath, "utf8");

//         // Use gray-matter to parse the post metadata section
//         const {
//           content,
//           data,
//         }: { content: any; data: { [key: string]: any } } =
//           matter(fileContents);

//         // Combine the data with the id
//         projects.push({
//           slug: slug,
//           meta: data as Project["meta"],
//           content: content,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//     return projects;
//   },
//   []
// );

// export default allProjects;
