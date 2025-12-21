import { FiDownload } from "react-icons/fi";
import Button from "@atoms/Button";
import InlineLink from "@atoms/InlineLink";
import {
  RichTextItemResponse,
  TextRichTextItemResponse,
  MentionRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import LinkPreviewMention from "./LinkPreviewMention";
import { cn } from "@lib/utils/cn";

const escapedNewLineToLineBreakTag = (string) => {
  return string.split("\n").map((item, index) => {
    return index === 0 ? item : [<br key={index} />, item];
  });
};

export type { RichTextItemResponse };

export const richTextObject = (
  richTextObject: RichTextItemResponse[],
  blockId?: string,
  filter?: (content: string) => string,
) => {
  return richTextObject.map((item, i) => {
    // Handle text type
    if (item.type === "text") {
      // In SDK v5.6.0+, RichTextItemResponse is an intersection type
      // so 'item' already has annotations, plain_text, href, etc.
      const textContent = filter
        ? filter(item.text.content)
        : item.text.content;
      let innerText: React.ReactNode = textContent;
      if (item.type == "text" && item.text) {
        const Tag = item.annotations.strikethrough
          ? "s"
          : item.annotations.bold
            ? "strong"
            : item.annotations.code
              ? "code"
              : "span";
        innerText = (
          <Tag
            className={cn(
              item.annotations.bold == true ? "font-semibold" : "",
              item.annotations.color == "red" && "text-red-600",
              item.annotations.italic && "italic",
              item.annotations.underline && "underline",
              item.annotations.code &&
                "bg-pill text-secondary rounded-md p-1 font-mono text-[0.8em] font-medium",
              item.annotations.strikethrough && "line-through",
            )}
            key={`${blockId}-${i}`}
          >
            {escapedNewLineToLineBreakTag(textContent)}
          </Tag>
        );
      }
      if (item.text.link) {
        if (
          (richTextObject.length == 1 &&
            item.text.content.startsWith("Download")) ||
          item.text.content.startsWith("Get") ||
          item.text.content.startsWith("View")
        ) {
          return (
            <Button
              key={`${blockId}-${i}`}
              href={item.text.link.url}
              showPopoutIcon
              icon={
                item.text.content == "Download" ? <FiDownload /> : undefined
              }
            >
              {innerText}
            </Button>
          );
        } else {
          return (
            <InlineLink key={`${blockId}-${i}`} href={item.text.link.url} wrap>
              {innerText}
            </InlineLink>
          );
        }
      } else {
        return innerText;
      }
    }
    // Handle mention type
    else if (item.type === "mention") {
      // In SDK v5.6.0+, item already has plain_text, href, annotations from RichTextItemResponseCommon
      const displayText = item.plain_text;

      // User mention
      if (item.mention.type === "user") {
        return (
          <span key={`${blockId}-${i}`} className="mention-user text-primary">
            {displayText}
          </span>
        );
      }
      // Page mention
      else if (item.mention.type === "page" && item.href) {
        return (
          <InlineLink key={`${blockId}-${i}`} href={item.href}>
            {displayText}
          </InlineLink>
        );
      }
      // Database mention
      else if (item.mention.type === "database" && item.href) {
        return (
          <InlineLink key={`${blockId}-${i}`} href={item.href}>
            {displayText}
          </InlineLink>
        );
      }
      // Date mention
      else if (item.mention.type === "date") {
        return (
          <span key={`${blockId}-${i}`} className="mention-date text-secondary">
            {displayText}
          </span>
        );
      }
      // Link mention (supports both link_mention and link_preview for compatibility)
      else if (
        item.mention.type === "link_mention" ||
        item.mention.type === "link_preview"
      ) {
        const url = item.href || "";
        // Notion API v2025-09-03 provides icon_url and title in the link_mention object
        const linkMention =
          item.mention.type === "link_mention"
            ? item.mention.link_mention
            : (item.mention as any).link_preview;

        const favicon = linkMention?.favicon || linkMention?.icon_url;
        const title = linkMention?.title || displayText;

        return (
          <LinkPreviewMention
            key={`${blockId}-${i}`}
            url={url}
            displayText={title}
            favicon={favicon}
          />
        );
      }
      // Template mention
      else if (item.mention.type === "template_mention") {
        return (
          <span key={`${blockId}-${i}`} className="mention text-secondary">
            {displayText}
          </span>
        );
      }
      // Fallback for any other mention types
      else {
        return (
          <span key={`${blockId}-${i}`} className="mention">
            {displayText}
          </span>
        );
      }
    }
    // Unknown type
    return null;
  });
};

export const richTextBlock = (block, filter?: (content: string) => string) => {
  if (block[block.type] && block[block.type].rich_text) {
    return richTextObject(block[block.type].rich_text, block.id, filter);
  } else {
    return null;
  }
};
