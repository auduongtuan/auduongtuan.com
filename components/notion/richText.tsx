import Link from "next/link";
import ExternalLink from "../atoms/ExternalLink";
const escapedNewLineToLineBreakTag = (string) => {
  return string.split("\n").map((item, index) => {
    return index === 0 ? item : [<br key={index} />, item];
  });
};

export const richTextObject = (richTextObject, blockId?: string) => {
  return richTextObject.map((item, i) => {
    if (item.type == "text" && item.text.link == null) {
      if (item.annotations.bold) {
        return (
          <strong className="font-medium" key={`${blockId}-${i}`}>
            {escapedNewLineToLineBreakTag(item.text.content)}
          </strong>
        );
      } else {
        return (
          <span key={`${blockId}-${i}`}>
            {escapedNewLineToLineBreakTag(item.text.content)}
          </span>
        );
      }
    } else if (item.text.link) {
      let checkInternal = item.text.link.url.match(/auduongtuan\.com\/(.*?)$/i);
      if (checkInternal) {
        return (
          <Link
            key={`${blockId}-${i}`}
            href={`/${checkInternal[1]}/`}
            className={`text-slate-600 underline underline-offset-4 decoration-gray-400 decoration-1 hover:text-blue-800 hover:decoration-blue-800 ${
              item.annotations.bold ? "font-semibold" : ""
            }`}
          >
            {item.text.content}
          </Link>
        );
      } else {
        return (
          <ExternalLink
            key={`${blockId}-${i}`}
            href={item.text.link.url}
            className={`text-slate-600 underline underline-offset-4 decoration-gray-400 decoration-1 hover:text-blue-800 hover:decoration-blue-800 ${
              item.annotations.bold ? "font-medium" : ""
            }`}
          >
            {item.text.content}
          </ExternalLink>
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