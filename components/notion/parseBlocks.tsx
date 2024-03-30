import { richTextBlock, richTextObject } from "./richText";
import { parseCallout } from "./callout";
import Heading from "./Heading";
import Bookmark from "./Bookmark";
import Disclosure from "@atoms/Disclosure";
import parseListItem from "./parseListItem";
import CustomImage from "@atoms/CustomImage";

const parseBlocks = (blocks: unknown) => {
  if (!Array.isArray(blocks) || blocks.length == 0) return null;
  let lastBlockIndex: { value: number } = { value: 0 };
  let content: React.ReactNode[] = [];
  while (lastBlockIndex.value < blocks.length) {
    const block = blocks[lastBlockIndex.value];
    switch (block.type) {
      case "paragraph":
        block.paragraph.rich_text.length > 0 &&
          content.push(
            <p key={block.id} className="body-text mt-content-node">
              {richTextBlock(block)}
            </p>
          );
        break;
      case "image":
        content.push(
          <div key={block.id} className="flex flex-col mt-content-node">
            <CustomImage
              className="max-w-full text-center"
              src={block.image.url}
              // src={`/api/notion-asset/block/${block.id}`}
              alt={block.image.alt ? block.image.alt : "Post Content Image"}
              width={block.image.width}
              height={block.image.height}
            />
            {block.image?.caption && block.image?.caption.length > 0 && (
              <p className="mt-2 text-sm">
                {richTextObject(block.image.caption, block.id)}
              </p>
            )}
          </div>
        );
        break;
      case "quote":
        content.push(
          <blockquote
            key={block.id}
            className="pl-4 border-l-2 border-gray-300 mt-content-node"
          >
            <p className="body-text mt-content-node">{richTextBlock(block)}</p>
            {parseBlocks(block.children)}
          </blockquote>
        );
        break;
      case "heading_2":
        content.push(<Heading block={block} key={block.id} />);
        break;
      case "heading_3":
        content.push(<Heading block={block} key={block.id} />);
        break;
      case "bookmark":
        content.push(<Bookmark block={block} key={block.id} />);
        break;
      case "toggle":
        content.push(
          <Disclosure
            title={richTextBlock(block)}
            key={block.id}
            className="mt-content-node"
          >
            {block.children && parseBlocks(block.children)}
          </Disclosure>
        );
        break;
      case "bulleted_list_item":
        const bulletedList = parseListItem(
          "bulleted_list_item",
          block,
          blocks,
          lastBlockIndex
        );
        if (bulletedList) content.push(bulletedList);
        break;
      case "numbered_list_item":
        const numberedList = parseListItem(
          "numbered_list_item",
          block,
          blocks,
          lastBlockIndex
        );
        if (numberedList) content.push(numberedList);
        break;
      // using callout as a container
      case "callout":
        content.push(parseCallout(block, blocks, lastBlockIndex));
        break;
    }
    lastBlockIndex.value++;
  }
  return content;
};

export default parseBlocks;
