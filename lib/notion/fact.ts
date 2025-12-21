const FACT_DATASOURCE_ID = process.env.FACT_DATASOURCE_ID as string;
import { notion, getProperty } from "@lib/notion";
import { RichTextItemResponse } from "@notion/richText";
import { isFullPage } from "@notionhq/client";
import React from "react";

export interface Fact {
  content: RichTextItemResponse[];
  slug: string;
}

export async function getFacts() {
  const response = await notion.dataSources.query({
    data_source_id: FACT_DATASOURCE_ID,
  });
  const posts = await Promise.all(
    response.results.map(async (page) => {
      if (!isFullPage(page)) return undefined;
      return {
        slug: getProperty(page, "Slug", "title"),
        content: getProperty(page, "Content", "rich_text", false),
      };
    }),
  );
  return posts.filter((page) => page) as Fact[];
}
