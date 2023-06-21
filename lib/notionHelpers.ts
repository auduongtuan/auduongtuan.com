const NOTION_RICH_TEXT_LIMIT = 2000;
const limitRegex = new RegExp(`.{1,${NOTION_RICH_TEXT_LIMIT}}`, "g");
export function breakRichTextChunks(longText: string): {
  type: "text";
  text: { content: string };
}[] {
  const chunks =
    longText.length > NOTION_RICH_TEXT_LIMIT
      ? longText.match(limitRegex)
      : null;
  return chunks
    ? chunks.map((part) => ({
        type: "text",
        text: {
          content: part,
        },
      }))
    : [
        {
          type: "text",
          text: {
            content: longText,
          },
        },
      ];
}
