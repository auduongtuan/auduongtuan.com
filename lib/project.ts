import fs from 'fs'
import path, {join} from 'path'
import matter from 'gray-matter'

const PROJECTS_PATH = path.join(process.cwd(), 'content/projects') 
console.log(PROJECTS_PATH);
export type Project = {
    slug: string;
    meta: {
        title: string,
        date: string,
        type: "casestudy" | "link" | "private",
        background?: string,
        contentBackground?: string,
        description?: string,
        tagline?: string,
        cover1?: string,
        cover2?: string,
        tools?: string[],
        roles?: string[],
        achievements?: string[],
        team?: string[],
        link?: string,
        browser?: boolean,
        half?: boolean,
        [key:string]: any
    };
    content: string;
    parsedContent?: any
}
export const projectSlugs = fs.readdirSync(PROJECTS_PATH).filter(fn => fn.endsWith('.mdx')).map(fileName => fileName.replace(/\.mdx$/, ''));
export const allProjects: Project[] = projectSlugs.reduce((projects: Project[], slug) => {
    const fullPath = join(PROJECTS_PATH, `${slug}.mdx`);
    // Read markdown file as string
    try {
        if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // Use gray-matter to parse the post metadata section
            const {content, data}:{content: any, data: {[key:string]: any}} = matter(fileContents)

            // Combine the data with the id
            projects.push({
                slug: slug,
                meta: data as Project["meta"],
                content: content
            });
        }
    } catch(err) {
        console.log(err);
    }
    return projects;
}, []);
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
