import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const COMMENT_DATABASE_ID = process.env.COMMENT_DATABASE_ID as string;
async function createComment({ name, content, email, page, header }) {
  let properties: any = {
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
  };
  if (name) {
    properties.Name = {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    };
  }
  if (email) {
    properties.Email = {
      email: email,
    };
  }
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: COMMENT_DATABASE_ID,
    },
    properties: properties,
  });
}

async function getComments(page) {
  if (!page) return {};
  const response = await notion.databases.query({
    database_id: COMMENT_DATABASE_ID,
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
        direction: "descending",
      },
    ],
  });
  if (response.results.length > 0) {
    // groupBy(response.results, )
    return response.results.map((record) => {
      // prevValue
      if ("properties" in record) {
        if (
          "title" in record.properties.Name &&
          "email" in record.properties.Email &&
          "rich_text" in record.properties.Content &&
          "created_time" in record.properties["Created time"]
        ) {
          return {
            name: record.properties.Name.title,
            email: record.properties.Email.email,
            content: record.properties.Content.rich_text,
            createdTime: record.properties["Created time"].created_time,
          };
        }
      }
    });
  } else {
    return [];
  }
}
const notionAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req);
  if (req.method === "POST") {
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
  } else if (req.method === "GET") {
    return res.status(200).json(await getComments(req.query.page));

    // return res.status(404).json({
    //   error: {
    //     code: 404,
    //     message: 'Only support POST method'
    //   }
    // })
  }
};
export default notionAPI;
