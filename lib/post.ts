import fs from 'fs'
import path, {join} from 'path'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'content/posts') 
console.log(POSTS_PATH);
export type Post = {
    slug: string,
    meta: {
        protected?: boolean,
        [key: string]: any,
    },
    content: string,
    parsedContent?: any
}
export const postSlugs = fs.readdirSync(POSTS_PATH).filter(fn => fn.endsWith('.mdx')).map(fileName => fileName.replace(/\.mdx$/, ''));

// export async function getPostBySlug(slug: string) {
//     // Remove ".mdx" from file name to get id
//     const fullPath = join(POSTS_PATH, `${slug}.mdx`);
    
//     // Read markdown file as string
//     const fileContents = fs.readFileSync(fullPath, 'utf8')

//     // Use gray-matter to parse the post metadata section
//     const {content, data} = matter(fileContents)

//     // Combine the data with the id
//     return {
//         slug: slug,
//         meta: data,
//         content: content
//     }
// }

export const allPosts: Post[] = postSlugs.reduce((posts: Post[], slug) => {
    const fullPath = join(POSTS_PATH, `${slug}.mdx`);
    
    // Read markdown file as string
    try {
        if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // Use gray-matter to parse the post metadata section
            const {content, data}:{content: any, data: {[key:string]: any}} = matter(fileContents)

            // Combine the data with the id
            posts.push({
                slug: slug,
                meta: data as Post["meta"],
                content: content
            });
        }
    } catch(err) {
        console.log(err);
    }
    return posts;
}, []);

export default allPosts;