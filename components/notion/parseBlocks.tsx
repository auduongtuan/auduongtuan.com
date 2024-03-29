import { richTextBlock, richTextObject } from "./richText";
import Heading from "./Heading";
import Bookmark from "./Bookmark";
import Disclosure from "@atoms/Disclosure";
import parseListItem from "./parseListItem";
import CustomImage from "@atoms/CustomImage";

const parseBlocks = (blocks: any[]) => {
  return blocks && blocks.length > 0
    ? blocks.reduce((content, block, blockIndex) => {
        let lastListItemBlockIndex: { value: null | number } = { value: null };
        switch (block.type) {
          case "paragraph":
            content.push(
              <p key={block.id} className="body-text mt-content-node">
                {richTextBlock(block)}
              </p>
            );
            return content;
          case "image":
            content.push(
              <div key={block.id} className="mt-content-node">
                <CustomImage
                  className="max-w-full text-center"
                  // src={block.image.file.url}
                  src={`/api/notion-asset/${block.id}`}
                  alt={block.image.alt ? block.image.alt : "Post Content Image"}
                  width={block.image.width}
                  height={block.image.height}
                />
                {block.image?.caption && (
                  <p className="mt-2 text-sm">
                    {richTextObject(block.image.caption, block.id)}
                  </p>
                )}
              </div>
            );
            return content;
          case "quote":
            content.push(
              <blockquote
                key={block.id}
                className="pl-4 border-l-2 border-gray-300 mt-content-node"
              >
                <p className="body-text mt-content-node">
                  {richTextBlock(block)}
                </p>
                {parseBlocks(block.children)}
              </blockquote>
            );
            return content;
          case "heading_2":
            content.push(<Heading block={block} key={block.id} />);
            return content;
          case "heading_3":
            content.push(<Heading block={block} key={block.id} />);
            return content;
          case "bookmark":
            content.push(<Bookmark block={block} key={block.id} />);
            return content;
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
            return content;
          case "bulleted_list_item":
            const bulletedList = parseListItem(
              "bulleted_list_item",
              block,
              blockIndex,
              blocks,
              lastListItemBlockIndex
            );
            if (bulletedList) content.push(bulletedList);
            return content;
          case "numbered_list_item":
            const numberedList = parseListItem(
              "numbered_list_item",
              block,
              blockIndex,
              blocks,
              lastListItemBlockIndex
            );
            if (numberedList) content.push(numberedList);
            return content;
          default:
            return content;
        }
      }, [])
    : null;
};

export default parseBlocks;
