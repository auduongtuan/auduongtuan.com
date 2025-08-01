const BLOG_DATABASE_ID = process.env.BLOG_DATABASE_ID as string;
import {
  notion,
  getProperty,
  PageIcon,
  getNotionPageContent,
  parseNotionPageAssets,
  NotionAssets,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";
import { isFullPage } from "@notionhq/client";

import { cache, shouldRevalidateCache } from "@lib/utils/cache";
export interface Post {
  id: string;
  slug: string;
  meta: {
    title: string;
    icon?: PageIcon;
    date: string;
    tags: string[];
    excerpt?: string;
    protected: boolean;
    passwordId?: string;
  };
  assets: NotionAssets;
}

export async function getPostsWithCache() {
  let posts: Post[];
  if (isDevEnvironment) {
    const forceRevalidate = shouldRevalidateCache();
    const cacheData = !forceRevalidate ? cache.get("posts") as Post[] : null;
    if (cacheData) {
      posts = cacheData;
    } else {
      posts = await getPosts(isDevEnvironment);
      cache.set("posts", posts, 24 * 1000 * 60 * 60);
      if (forceRevalidate) {
        console.log("🔄 Cache revalidated for posts");
      }
    }
  } else {
    posts = await getPosts(isDevEnvironment);
  }
  return posts;
}

export async function getPosts(includeUnpublished?: boolean) {
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
    database_id: BLOG_DATABASE_ID,
    filter: filterQuery,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });
  const posts = await Promise.all(
    response.results.map(async (page) => {
      if (!isFullPage(page)) return undefined;
      const assets = await parseNotionPageAssets(page);
      return {
        id: page.id,
        slug: getProperty(page, "Slug", "rich_text"),
        meta: {
          title: getProperty(page, "Title", "title"),
          date: getProperty(page, "Date", "date"),
          protected: getProperty(page, "Protected", "checkbox"),
          tags: getProperty(page, "Tags", "multi_select"),
          excerpt: getProperty(page, "Excerpt", "rich_text"),
          icon: "icon" in page ? page.icon : undefined,
          passwordId: getProperty(page, "Password", "relation")[0] || null,
        },
        assets: assets,
      };
    }),
  );
  const filteredPosts = posts.filter((page) => page) as Post[];
  
  // Remove undefined values for JSON serialization
  const cleanPosts = filteredPosts.map(post => 
    Object.fromEntries(
      Object.entries(post).filter(([_, value]) => value !== undefined)
    )
  ) as Post[];
  
  return cleanPosts;
}

export const getPostContent = async (id: string) => {
  return await getNotionPageContent(id);
};
