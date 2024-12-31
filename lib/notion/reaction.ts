import { Client } from "@notionhq/client";
import { breakRichTextChunks } from "./helpers";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const REACTION_DATABASE_ID = process.env.REACTION_DATABASE_ID as string;

export async function getReactions({ page, ip }) {
  if (!page) return {};
  const response = await notion.databases.query({
    database_id: REACTION_DATABASE_ID,
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
        direction: "ascending",
      },
    ],
  });
  if (response.results.length > 0) {
    // groupBy(response.results, )
    return response.results.reduce((acc, current) => {
      // prevValue
      if ("properties" in current) {
        if (
          "title" in current.properties.React &&
          "rich_text" in current.properties.Ip
        ) {
          if (
            current.properties.React.title.length > 0 &&
            current.properties.Ip.rich_text.length > 0
          ) {
            const saved_ip = current.properties.Ip.rich_text[0]
              .plain_text as string;
            const reaction = current.properties.React.title[0]
              .plain_text as string;
            if (reaction in acc) {
              acc[reaction].quantity++;
            } else {
              acc[reaction] = { quantity: 1 };
            }
            // if (saved_ip == ip) {
            acc[reaction].reacted = saved_ip == ip;
            // }
          }
        }
      }
      return acc;
    }, {});
  } else {
    return {};
  }
}
export async function findReaction({ react, page, ip }) {
  return await notion.databases.query({
    database_id: REACTION_DATABASE_ID,
    filter: {
      and: [
        {
          property: "Page",
          rich_text: {
            equals: page,
          },
        },
        {
          property: "React",
          title: {
            equals: react,
          },
        },
        {
          property: "Ip",
          title: {
            equals: ip,
          },
        },
      ],
    },
  });
}
export async function removeReaction({ react, page, ip }) {
  const reactionFound = await findReaction({ react, page, ip });
  if (reactionFound.results.length > 0) {
    const deleteResponse = await notion.blocks.delete({
      block_id: reactionFound.results[0].id,
    });
    return deleteResponse;
  }
}
export async function addReaction({
  react,
  page,
  header,
  ip,
}: {
  react: string;
  page: string;
  header: string;
  ip: string;
}) {
  const reactionFound = await findReaction({ react, page, ip });
  if (reactionFound.results.length > 0) {
    return reactionFound;
  }

  return await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: REACTION_DATABASE_ID,
    },
    properties: {
      React: {
        title: [
          {
            text: {
              content: react,
            },
          },
        ],
      },
      Header: {
        rich_text: breakRichTextChunks(header),
      },
      Ip: {
        rich_text: [
          {
            text: {
              content: ip,
            },
          },
        ],
      },
      Page: {
        rich_text: [
          {
            text: {
              content: page,
            },
          },
        ],
      },
    },
  });
}
