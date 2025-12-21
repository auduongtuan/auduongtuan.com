import { notion, breakRichTextChunks } from "@lib/notion";
const COMMENT_DATASOURCE_ID = process.env.COMMENT_DATASOURCE_ID as string;

export async function createComment({ name, content, email, page, header }) {
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
  return response;
}

export async function getComments(page) {
  if (!page) return {};
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
    // groupBy(response.results, )
    return response.results.map((record) => {
      // prevValue
      if ("properties" in record) {
        if (
          "title" in record.properties.Name &&
          "email" in record.properties.Email &&
          "rich_text" in record.properties.Content &&
          "created_time" in record.properties["Created time"]
        ) {
          return {
            name: record.properties.Name.title,
            email: record.properties.Email.email,
            content: record.properties.Content.rich_text,
            createdTime: record.properties["Created time"].created_time,
          };
        }
      }
    });
  } else {
    return [];
  }
}
