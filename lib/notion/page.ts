import {
  getBlockChildren,
  getMediaFromProperty,
  getPageIconFile,
  getProperty,
  notion,
} from "@lib/notion";
import { isFullPage } from "@notionhq/client";

export async function updateNotionPageAssets(assets: any, pageId: string) {
  let json = JSON.stringify(assets);
  let chunks: string[] = [];
  for (var i = 0, charsLength = json.length; i < charsLength; i += 2000) {
    chunks.push(json.substring(i, i + 2000));
  }
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Assets: {
        rich_text: chunks.map((chunk) => ({
          type: "text",
          text: { content: chunk },
        })),
      },
    },
  });
}

export const parseNotionPageAssets = async (page: any) => {
  if (!isFullPage(page)) return undefined;
  const assetsJson = getProperty(page, "Assets", "rich_text") || "{}";
  const assets = JSON.parse(assetsJson);

  let update: boolean = false;
  if (!("cover" in assets) || !assets.cover || assets.cover.length === 0) {
    const cover = await getMediaFromProperty(page, "Cover");
    if (cover) {
      assets.cover = cover;
      update = true;
    }
  }
  if (!("icon" in assets) || !assets.icon) {
    const pageIcon = await getPageIconFile(page);
    if (pageIcon) {
      assets.icon = pageIcon;
      update = true;
    }
  }
  if (update) {
    await updateNotionPageAssets(assets, page.id);
  }
  return assets;
};

export const getNotionPageContent = async (pageId: string) => {
  const page = await notion.pages.retrieve({
    page_id: pageId,
  });
  const assetsJson = getProperty(page, "Assets", "rich_text") || "{}";
  const assets = JSON.parse(assetsJson);
  const results = await getBlockChildren(pageId, assets);
  await updateNotionPageAssets(assets, pageId);
  return results;
};
