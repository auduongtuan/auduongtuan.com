import { notion, breakRichTextChunks } from "@lib/notion";
import {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const COMMENT_DATASOURCE_ID = process.env.COMMENT_DATASOURCE_ID as string;

export type Comment = {
  name: RichTextItemResponse[];
  email: string | null;
  content: RichTextItemResponse[];
  createdTime: string;
};

export type CreateCommentParams = {
  name?: string;
  content: string;
  email?: string;
  page: string;
  header: string;
};

export async function createComment({
  name,
  content,
  email,
  page,
  header,
}: CreateCommentParams): Promise<PageObjectResponse> {
  let properties: any = {
    Content: {
      rich_text: breakRichTextChunks(content),
    },
    Page: {
      rich_text: breakRichTextChunks(page),
    },
    Header: {
      rich_text: breakRichTextChunks(header),
    },
  };
  if (name) {
    properties.Name = {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    };
  }
  if (email) {
    properties.Email = {
      email: email,
    };
  }
  const response = await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: COMMENT_DATASOURCE_ID,
    },
    properties: properties,
  });
  return response as PageObjectResponse;
}

export async function getComments(page?: string): Promise<Comment[]> {
  if (!page) return [];
  // SDK v5.6.0: databases.query moved to dataSources.query
  const response = await notion.dataSources.query({
    data_source_id: COMMENT_DATASOURCE_ID,
    filter: {
      and: [
        {
          property: "Page",
          rich_text: {
            equals: page,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Created time",
        direction: "descending",
      },
    ],
  });

  if (response.results.length > 0) {
    return response.results
      .map((record) => {
        if ("properties" in record) {
          const pageRecord = record as PageObjectResponse;
          if (
            "title" in pageRecord.properties.Name &&
            "email" in pageRecord.properties.Email &&
            "rich_text" in pageRecord.properties.Content &&
            "created_time" in pageRecord.properties["Created time"]
          ) {
            return {
              name: pageRecord.properties.Name.title,
              email: pageRecord.properties.Email.email,
              content: pageRecord.properties.Content.rich_text,
              createdTime: pageRecord.properties["Created time"].created_time,
            };
          }
        }
        return null;
      })
      .filter((comment): comment is Comment => comment !== null);
  }

  return [];
}
