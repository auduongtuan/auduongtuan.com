import { FiDownload } from "react-icons/fi";
import Button from "@atoms/Button";
import InlineLink from "@atoms/InlineLink";
import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { cn } from "@lib/utils/cn";

const escapedNewLineToLineBreakTag = (string) => {
  return string.split("\n").map((item, index) => {
    return index === 0 ? item : [<br key={index} />, item];
  });
};

export const richTextObject = (
  richTextObject: RichTextItemResponse[],
  blockId?: string,
  filter?: (content: string) => string,
) => {
  return richTextObject.map((item, i) => {
    if (item.type !== "text") return null;
    const textItem = item as TextRichTextItemResponse;
    const textContent = filter
      ? filter(textItem.text.content)
      : textItem.text.content;
    let innerText: React.ReactNode = textContent;
    if (textItem.type == "text" && textItem.text) {
      const Tag = textItem.annotations.strikethrough
        ? "s"
        : textItem.annotations.bold
          ? "strong"
          : textItem.annotations.code
            ? "code"
            : "span";
      innerText = (
        <Tag
          className={cn(
            textItem.annotations.bold == true ? "font-semibold" : "",
            textItem.annotations.color == "red" && "text-red-600",
            textItem.annotations.italic && "italic",
            textItem.annotations.underline && "underline",
            textItem.annotations.code &&
              "bg-pill text-secondary rounded-md p-1 font-mono text-[0.8em] font-medium",
            textItem.annotations.strikethrough && "line-through",
          )}
          key={`${blockId}-${i}`}
        >
          {escapedNewLineToLineBreakTag(textContent)}
        </Tag>
      );
    }
    if (textItem.text.link) {
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
            {innerText}
          </Button>
        );
      } else {
        return (
          <InlineLink
            key={`${blockId}-${i}`}
            href={textItem.text.link.url}
            wrap
          >
            {innerText}
          </InlineLink>
        );
      }
    } else {
      return innerText;
    }
  });
};

export const richTextBlock = (block, filter?: (content: string) => string) => {
  if (block[block.type] && block[block.type].rich_text) {
    return richTextObject(block[block.type].rich_text, block.id, filter);
  } else {
    return null;
  }
};
