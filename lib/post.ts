import fs from 'fs'
import path, {join} from 'path'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'content/posts') 
console.log(POSTS_PATH);
export type Post = {
    slug: string,
    meta: {
        [key: string]: any,
    },
    content: string,
    parsedContent?: any
}
export function getPostSlugs(): string[] {
    return fs.readdirSync(POSTS_PATH).filter(fn => fn.endsWith('.mdx')).map(fileName => fileName.replace(/\.mdx$/, ''));
}
export async function getPostBySlug(slug: string) {
    // Remove ".mdx" from file name to get id
    const fullPath = join(POSTS_PATH, `${slug}.mdx`);
    
    // Read markdown file as string
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const {content, data} = matter(fileContents)

    // Combine the data with the id
    return {
        slug: slug,
        meta: data,
        content: content
    }
}
export async function getAllPosts() {
    return await Promise.all(getPostSlugs().map(async slug => {
        return await getPostBySlug(slug);
    }))
}