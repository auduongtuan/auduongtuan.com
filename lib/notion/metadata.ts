import { notion, getProperty } from "@lib/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const METADATA_DATASOURCE_ID = process.env.METADATA_DATASOURCE_ID as string;

export type MetadataRecord = {
  key: string;
  page?: string;
  value?: string;
  createdTime: string;
  lastEditedTime: string;
};

export async function getMetadata(
  key: string,
  page?: string,
): Promise<MetadataRecord | null> {
  const filters: any[] = [
    {
      property: "Key",
      title: {
        equals: key,
      },
    },
  ];

  if (page) {
    filters.push({
      property: "Page",
      rich_text: {
        equals: page,
      },
    });
  }

  const response = await notion.dataSources.query({
    data_source_id: METADATA_DATASOURCE_ID,
    filter: {
      and: filters,
    },
  });

  if (response.results.length > 0) {
    const record = response.results[0];
    if ("properties" in record) {
      const pageRecord = record as PageObjectResponse;
      return {
        key: getProperty(pageRecord, "Key", "title") || key,
        page: getProperty(pageRecord, "Page", "rich_text"),
        value: getProperty(pageRecord, "Value", "rich_text"),
        createdTime: pageRecord.created_time,
        lastEditedTime: pageRecord.last_edited_time,
      };
    }
  }

  return null;
}

export async function setMetadata(
  key: string,
  value: string,
  page?: string,
): Promise<void> {
  // Check if metadata already exists
  const existing = await getMetadata(key, page);

  if (existing) {
    // Update existing metadata
    // Note: We would need the page ID to update, which we don't have in the query result
    // This is a placeholder for future implementation
    console.warn("Metadata update not yet implemented");
  } else {
    // Create new metadata
    type PropertyValueMap = NonNullable<
      Parameters<typeof notion.pages.create>[0]["properties"]
    >;

    const properties: PropertyValueMap = {
      Key: {
        title: [
          {
            text: {
              content: key,
            },
          },
        ],
      },
      Value: {
        rich_text: [
          {
            text: {
              content: value,
            },
          },
        ],
      },
    };

    if (page) {
      properties.Page = {
        rich_text: [
          {
            text: {
              content: page,
            },
          },
        ],
      };
    }

    await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: METADATA_DATASOURCE_ID,
      },
      properties,
    });
  }
}
