import { notion } from "./base";
import { breakRichTextChunks } from "./helpers";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const REACTION_DATASOURCE_ID = process.env.REACTION_DATASOURCE_ID as string;

export type ReactionCounts = {
  [reaction: string]: {
    quantity: number;
    reacted: boolean;
  };
};

export type GetReactionsParams = {
  page: string;
  ip: string;
};

export type AddReactionParams = {
  react: string;
  page: string;
  header: string;
  ip: string;
  event?: "click" | "swipe" | "double_tap";
};

export async function getReactions({
  page,
  ip,
}: GetReactionsParams): Promise<ReactionCounts> {
  if (!page) return {} as ReactionCounts;
  const response = await notion.dataSources.query({
    data_source_id: REACTION_DATASOURCE_ID,
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
        const pageRecord = current as PageObjectResponse;
        if (
          "title" in pageRecord.properties.React &&
          "rich_text" in pageRecord.properties.Ip
        ) {
          if (
            pageRecord.properties.React.title.length > 0 &&
            pageRecord.properties.Ip.rich_text.length > 0
          ) {
            const saved_ip = pageRecord.properties.Ip.rich_text[0]
              .plain_text as string;
            const reaction = pageRecord.properties.React.title[0]
              .plain_text as string;
            if (reaction in acc) {
              acc[reaction].quantity++;
            } else {
              acc[reaction] = { quantity: 1, reacted: false };
            }
            // if (saved_ip == ip) {
            acc[reaction].reacted = saved_ip == ip;
            // }
          }
        }
      }
      return acc;
    }, {} as ReactionCounts);
  } else {
    return {} as ReactionCounts;
  }
}
export async function findReaction({
  react,
  page,
  ip,
}: Omit<AddReactionParams, "header" | "event">) {
  return await notion.dataSources.query({
    data_source_id: REACTION_DATASOURCE_ID,
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
export async function removeReaction({
  react,
  page,
  ip,
}: Omit<AddReactionParams, "header" | "event">) {
  const reactionFound = await findReaction({ react, page, ip });
  if (reactionFound.results.length > 0) {
    const deleteResponse = await notion.blocks.delete({
      block_id: reactionFound.results[0].id,
    });
    return deleteResponse;
  }
  return null;
}

export async function addReaction({
  react,
  page,
  header,
  ip,
  event = "click",
}: AddReactionParams): Promise<PageObjectResponse> {
  const reactionFound = await findReaction({ react, page, ip });
  if (reactionFound.results.length > 0) {
    return reactionFound.results[0] as PageObjectResponse;
  }

  const response = await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: REACTION_DATASOURCE_ID,
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
      Event: {
        select: {
          name: event,
        },
      },
    },
  });

  return response as PageObjectResponse;
}
