import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const REACTION_DATABASE_ID = process.env.REACTION_DATABASE_ID as string;

async function getReactions({ page, ip }) {
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
async function findReaction({ react, page, ip }) {
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
async function removeReaction({ react, page, ip }) {
  const reactionFound = await findReaction({ react, page, ip });
  if (reactionFound.results.length > 0) {
    const deleteResponse = await notion.blocks.delete({
      block_id: reactionFound.results[0].id,
    });
    return deleteResponse;
  }
}
async function addReaction({ react, page, header, ip }) {
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
        rich_text: [
          {
            text: {
              content: header,
            },
          },
        ],
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

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req);
  // console.log(req);
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;
  if (req.method === "POST") {
    if (req.body.type == "REMOVE") {
      try {
        const data = {
          react: req.body.react,
          ip: ip,
          page: req.body.page,
        };
        return res.status(200).json(await removeReaction(data));
      } catch (err) {
        return res.status(500).json({
          error: {
            code: 500,
            message: err,
          },
        });
      }
    }
    // ADD REACTION
    else if (req.body.type == "ADD") {
      try {
        const data = {
          react: req.body.react,
          header: JSON.stringify(req.headers),
          ip: ip,
          page: req.body.page,
        };
        await addReaction(data);
        return res.status(200).json({
          data: data,
        });
      } catch (err) {
        return res.status(500).json({
          error: {
            code: 500,
            message: err,
          },
        });
      }
    }
  } else {
    const data = await getReactions({ page: req.query.page, ip: ip });
    return res.status(200).json(data);
  }
};
export default notionAPI;
