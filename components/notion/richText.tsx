import { FiDownload } from "react-icons/fi";
import Button from "@atoms/Button";
import InlineLink from "@atoms/InlineLink";
import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { twMerge } from "tailwind-merge";

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
      const Tag = textItem.annotations.bold
        ? "strong"
        : textItem.annotations.code
        ? "code"
        : "span";
      return (
        <Tag
          className={twMerge(
            textItem.annotations.bold == true ? "font-semibold" : "",
            textItem.annotations.color == "red" && "text-red-600",
            textItem.annotations.code &&
              "bg-pill rounded-md p-1 text-[0.8em] font-medium text-secondary font-mono"
          )}
          key={`${blockId}-${i}`}
        >
          {escapedNewLineToLineBreakTag(textItem.text.content)}
        </Tag>
      );
    } else if (textItem.text.link) {
      if (
        (richTextObject.length == 1 &&
          textItem.text.content.startsWith("Download")) ||
        textItem.text.content.startsWith("Get") ||
        textItem.text.content.startsWith("View")
      ) {
        return (
          <Button
            key={`${blockId}-${i}`}
            href={textItem.text.link.url}
            showPopoutIcon
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
            className={`${textItem.annotations.bold ? "font-semibold" : ""}`}
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
