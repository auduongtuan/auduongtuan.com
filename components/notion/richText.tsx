import { FiDownload } from "react-icons/fi";
import Button from "../atoms/Button";
import InlineLink from "../atoms/InlineLink";
import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
const escapedNewLineToLineBreakTag = (string) => {
  return string.split("\n").map((item, index) => {
    return index === 0 ? item : [<br key={index} />, item];
  });
};

export const richTextObject = (
  richTextObject: RichTextItemResponse[],
  blockId?: string
) => {
  return richTextObject.map((item, i) => {
    if (item.type !== "text") return null;
    const textItem = item as TextRichTextItemResponse;
    if (
      textItem.type == "text" &&
      textItem.text &&
      textItem.text.link == null
    ) {
      if (textItem.annotations.bold) {
        return (
          <strong className="font-medium" key={`${blockId}-${i}`}>
            {escapedNewLineToLineBreakTag(textItem.text.content)}
          </strong>
        );
      } else {
        return (
          <span key={`${blockId}-${i}`}>
            {escapedNewLineToLineBreakTag(textItem.text.content)}
          </span>
        );
      }
    } else if (textItem.text.link) {
      if (
        (richTextObject.length == 1 &&
          textItem.text.content.startsWith("Download")) ||
        textItem.text.content.startsWith("Get")
      ) {
        return (
          <Button
            key={`${blockId}-${i}`}
            href={textItem.text.link.url}
            external
            icon={
              textItem.text.content == "Download" ? <FiDownload /> : undefined
            }
          >
            {textItem.text.content}
          </Button>
        );
      } else {
        return (
          <InlineLink
            key={`${blockId}-${i}`}
            href={textItem.text.link.url}
            className={`${
              textItem.annotations.bold ? "font-semibold" : ""
            } text-slate-700`}
            wrap
          >
            {textItem.text.content}
          </InlineLink>
        );
      }
    }
  });
};
export const richTextBlock = (block) => {
  if (block[block.type] && block[block.type].rich_text) {
    return richTextObject(block[block.type].rich_text, block.id);
  } else {
    return null;
  }
};
