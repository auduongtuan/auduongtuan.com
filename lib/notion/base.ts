import { Client } from "@notionhq/client";
export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const NOTION_RICH_TEXT_LIMIT = 2000;
