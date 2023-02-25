import InlineLink from "../atoms/InlineLink";
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
      return <InlineLink key={`${blockId}-${i}`} href={item.text.link.url} className={`${item.annotations.bold ? "font-semibold" : ""} text-slate-700`}>{item.text.content}</InlineLink>     
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