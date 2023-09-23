import Disclosure from "@atoms/Disclosure";
import parseBlocks from "./parseBlocks";
import clsx from "clsx";
const Heading = ({ block }) => {
  const textStyles = {
    heading_2: "h2",
    heading_3: "h3",
  };
  const gutterTop = {
    heading_2: "mt-8 md:mt-12 first:mt-0",
    heading_3: "mt-4 md:mt-8 -mb-2 first:mt-0",
  };
  const Tag = block.type.replace("heading_", "h");
  const title = (
    <Tag
      className={clsx(textStyles[block.type], {
        [gutterTop[block.type]]: !block.has_children,
      })}
    >
      {block[block.type].rich_text[0]?.plain_text}
    </Tag>
  );
  return block.has_children ? (
    <Disclosure title={title} className={gutterTop[block.type]}>
      {block.children && parseBlocks(block.children)}
    </Disclosure>
  ) : (
    title
  );
};
export default Heading;
