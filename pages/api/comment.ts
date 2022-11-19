import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from 'next'
const notion = new Client({ auth: process.env.NOTION_API_KEY });
async function createComment({name, content, email, page, header}) {
  const response = await notion.pages.create({
    // cover: {
    //   type: "external",
    //   external: {
    //     url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
    //   },
    // },
    // icon: {
    //   type: "emoji",
    //   emoji: "🥬",
    // },
    parent: {
      type: "database_id",
      database_id: "b71a4c06cd7e4053a0d963a62e3f789b",
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Content: {
        rich_text: [
          {
            text: {
              content: content,
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
      Header: {
        rich_text: [
          {
            text: {
              content: header,
            },
          },
        ],
      },
      Email: {
        email: email,
      },
    },
    // children: [
    //   {
    //     object: "block",
    //     heading_2: {
    //       rich_text: [
    //         {
    //           text: {
    //             content: "Lacinato kale",
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     object: "block",
    //     paragraph: {
    //       rich_text: [
    //         {
    //           text: {
    //             content:
    //               "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
    //             link: {
    //               url: "https://en.wikipedia.org/wiki/Lacinato_kale",
    //             },
    //           },
    //           href: "https://en.wikipedia.org/wiki/Lacinato_kale",
    //         },
    //       ],
    //       color: "default",
    //     },
    //   },
    // ],
  });
}

const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req);
  if (req.method === 'POST') {
    try {
      const data = {
        name: req.body.name,
        content: req.body.content,
        email: req.body.email,
        page: req.body.page,
        header: JSON.stringify(req.headers),
      };
      await createComment(data);
      return res.status(200).json({
        data: data
      });
    }
    catch(err) {
      return res.status(500).json({
        error: {
          code: 500,
          message: err
        }
      })
    }
  } else {
    return res.status(404).json({
      error: {
        code: 404,
        message: 'Only support POST method'
      }
    })
  }
};
export default notionAPI;
