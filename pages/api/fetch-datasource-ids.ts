import { NextApiRequest, NextApiResponse } from "next";
import { notion } from "@lib/notion/base";

const databases = {
  BLOG_DATABASE_ID: process.env.BLOG_DATABASE_ID,
  PROJECT_DATABASE_ID: process.env.PROJECT_DATABASE_ID,
  COMMENT_DATABASE_ID: process.env.COMMENT_DATABASE_ID,
  REACTION_DATABASE_ID: process.env.REACTION_DATABASE_ID,
  FACT_DATABASE_ID: process.env.FACT_DATABASE_ID,
  NOW_DATABASE_ID: process.env.NOW_DATABASE_ID,
  TRACKING_DATABASE_ID: process.env.TRACKING_DATABASE_ID,
  METADATA_DATABASE_ID: process.env.METADATA_DATABASE_ID,
  PROJECT_GROUP_DATABASE_ID: process.env.PROJECT_GROUP_DATABASE_ID,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const results: Record<string, any> = {};

  for (const [name, databaseId] of Object.entries(databases)) {
    if (!databaseId) {
      results[name] = { error: "No database ID found" };
      continue;
    }

    try {
      const response = await notion.databases.retrieve({
        database_id: databaseId,
      });

      // In API v2025-09-03, databases have a data_sources array
      // The first data source is the primary one
      const dataSources = (response as any).data_sources;
      const dataSourceId =
        dataSources && dataSources.length > 0
          ? dataSources[0].id
          : (response as any).id; // Fallback to database ID

      const newName = name.replace("_DATABASE_ID", "_DATASOURCE_ID");

      results[name] = {
        databaseId,
        dataSourceId,
        dataSources: dataSources || [],
        envName: newName,
      };
    } catch (error: any) {
      results[name] = {
        error: error.message,
        databaseId,
      };
    }
  }

  // Format as .env file content
  const envContent = Object.entries(results)
    .map(([name, data]) => {
      if (data.error) {
        return `# ${name}: ${data.error}`;
      }
      return `${data.envName}=${data.dataSourceId}`;
    })
    .join("\n");

  return res.json({
    results,
    envContent,
  });
}
