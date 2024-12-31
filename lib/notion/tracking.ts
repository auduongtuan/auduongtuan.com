import { notion, breakRichTextChunks } from "@lib/notion";
const TRACKING_DATABASE_ID = process.env.TRACKING_DATABASE_ID as string;

export async function createTracking({ event, content, page, header }) {
  let properties: any = {
    Content: {
      rich_text: breakRichTextChunks(content),
    },
    Page: {
      rich_text: breakRichTextChunks(page),
    },
    Header: {
      rich_text: breakRichTextChunks(header),
    },
  };
  if (event) {
    properties.Event = {
      title: [
        {
          text: {
            content: event,
          },
        },
      ],
    };
  }
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: TRACKING_DATABASE_ID,
    },
    properties: properties,
  });
  return response;
}

// export async function getComments(page) {
//   if (!page) return {};
//   const response = await notion.databases.query({
//     database_id: TRACKING_DATABASE_ID,
//     filter: {
//       and: [
//         {
//           property: "Page",
//           rich_text: {
//             equals: page,
//           },
//         },
//       ],
//     },
//     sorts: [
//       {
//         property: "Created time",
//         direction: "descending",
//       },
//     ],
//   });
//   if (response.results.length > 0) {
//     // groupBy(response.results, )
//     return response.results.map((record) => {
//       // prevValue
//       if ("properties" in record) {
//         if (
//           "title" in record.properties.Name &&
//           "email" in record.properties.Email &&
//           "rich_text" in record.properties.Content &&
//           "created_time" in record.properties["Created time"]
//         ) {
//           return {
//             name: record.properties.Name.title,
//             email: record.properties.Email.email,
//             content: record.properties.Content.rich_text,
//             createdTime: record.properties["Created time"].created_time,
//           };
//         }
//       }
//     });
//   } else {
//     return [];
//   }
// }
