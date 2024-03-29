import parseBlocks from "./parseBlocks";
import { richTextBlock } from "./richText";
type ListItemType = "bulleted_list_item" | "numbered_list_item";

const parseListItem = (
  listItemType: ListItemType,
  block,
  blockIndex,
  blocks,
  lastListItemBlockIndex
) => {
  if (
    (blockIndex > 0 && blocks[blockIndex - 1].type != listItemType) ||
    blockIndex == 0
  ) {
    const Tag = listItemType == "numbered_list_item" ? "ol" : "ul";
    lastListItemBlockIndex.value = blockIndex;
    let listItemBlocks: any[] = [];
    while (
      blocks[lastListItemBlockIndex.value] &&
      "type" in blocks[lastListItemBlockIndex.value] &&
      blocks[lastListItemBlockIndex.value].type == listItemType &&
      lastListItemBlockIndex.value <= blocks.length - 1
    ) {
      listItemBlocks.push(blocks[lastListItemBlockIndex.value]);
      lastListItemBlockIndex.value++;
    }
    return (
      <Tag
        className="pl-8 mt-3 list-disc body-text md:mt-4 mt-content-node"
        key={`list-${block.id}`}
      >
        {listItemBlocks.map((item) => (
          <li key={item.id} className="mt-2 md:mt-3 first:mt-0">
            {richTextBlock(item)}
            {parseBlocks(block.children)}
          </li>
        ))}
      </Tag>
    );
  } else {
    return null;
  }
};

export default parseListItem;
