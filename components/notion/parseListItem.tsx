import parseBlocks from "./parseBlocks";
import { richTextBlock } from "./richText";
type ListItemType = "bulleted_list_item" | "numbered_list_item";

const parseListItem = (
  listItemType: ListItemType,
  block,
  blocks,
  lastBlockIndex
) => {
  const Tag = listItemType == "numbered_list_item" ? "ol" : "ul";
  let listItemBlocks: any[] = [];
  while (
    blocks[lastBlockIndex.value] &&
    "type" in blocks[lastBlockIndex.value] &&
    blocks[lastBlockIndex.value].type == listItemType &&
    lastBlockIndex.value <= blocks.length - 1
  ) {
    listItemBlocks.push(blocks[lastBlockIndex.value]);
    lastBlockIndex.value++;
  }
  // give back the last item
  lastBlockIndex.value--;
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
};

export default parseListItem;
