import Disclosure from "@atoms/Disclosure";
import parseBlocks from "./parseBlocks";
import clsx from "clsx";
import { richTextBlock } from "./richText";
const Heading = ({ block }) => {
  const gutterTop = {
    h2: "mt-8 md:mt-12 first:mt-0",
    h3: "mt-4 md:mt-8 -mb-2 first:mt-0",
  };
  let Tag = block.type.replace("heading_", "h");
  let text = block[block.type].rich_text[0]?.plain_text;
  const marks = {
    h4: "→",
    h5: "→→",
    h6: "→→→",
  };
  for (const [key, value] of Object.entries(marks)) {
    if (text.startsWith(value)) {
      Tag = key;
      text = text.replace(value, "").trim();
    }
  }
  const title = (
    <Tag className={clsx(Tag, !block.has_children && [gutterTop[Tag]])}>
      {richTextBlock(block)}
    </Tag>
  );
  return block.has_children ? (
    <Disclosure title={title} className={gutterTop[Tag]}>
      {block.children && parseBlocks(block.children)}
    </Disclosure>
  ) : (
    title
  );
};
export default Heading;
