import { isFullPage } from "@notionhq/client";
import { notion, getProperty } from "@lib/notion";

const NOW_DATABASE_ID = process.env.NOW_DATABASE_ID as string;

export type NotionNowItem = {
  title: string;
  content: string;
  link: string | undefined;
  thumbnail: string | null;
};

export async function getNotionNowItems(): Promise<NotionNowItem[]> {
  const response = await notion.databases.query({
    database_id: NOW_DATABASE_ID,
    // sorts: [
    //   {
    //     timestamp: "last_edited_time",
    //     direction: "descending",
    //   },
    // ],
  });

  const nowItems = await Promise.all(
    response.results.map(async (page) => {
      if (!isFullPage(page)) return undefined;
      const link = getProperty(page, "Link", "url");
      let thumbnail: string | null = null;
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const spotifyRegex =
        /(?:https?:\/\/)?(?:open\.spotify\.com\/|spotify:)([a-z]+)(?:[/:])([a-zA-Z0-9]+)(?:\?.*)?/;
      if (link) {
        const youtubeMatch = link.match(youtubeRegex);
        const spotifyMatch = link.match(spotifyRegex);
        if (youtubeMatch) {
          thumbnail = `https://img.youtube.com/vi/${youtubeMatch[1]}/0.jpg`;
        } else if (spotifyMatch) {
          await fetch(
            `https://embed.spotify.com/oembed/?url=spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
          ).then(async (res) => {
            const info = await res.json();
            thumbnail = info.thumbnail_url;
          });
        }
      }
      return {
        title: getProperty(page, "Title", "title"),
        link: getProperty(page, "Link", "url"),
        content: getProperty(page, "Content", "rich_text"),
        thumbnail,
      };
    })
  );

  return nowItems.filter((page) => page) as NotionNowItem[];
}
