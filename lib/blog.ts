const BLOG_DATABASE_ID = process.env.BLOG_DATABASE_ID as string;
import {
  notion,
  getProperty,
  getBlockChildren,
  PageIcon,
} from "./notionHelpers";
export interface Post {
  id: string;
  slug: string;
  meta: {
    title: string;
    icon?: PageIcon;
    date: string;
    protected: boolean;
    tags: string[];
    excerpt?: string;
  };
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
  return response.results.map((page) => {
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
      },
    };
  });
}

export const getPostContent = async (id: string) => {
  const results = await getBlockChildren(id);
  return results;
};
