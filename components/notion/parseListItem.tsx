import { NotionAssets } from "@lib/notion";
import parseBlocks from "./parseBlocks";
import { richTextBlock } from "./richText";
type ListItemType = "bulleted_list_item" | "numbered_list_item";

const parseListItem = (
  listItemType: ListItemType,
  block,
  blocks,
  lastBlockIndex,
  assets?: NotionAssets,
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
      className="body-text mt-content-node list-disc pl-8"
      key={`list-${block.id}`}
    >
      {listItemBlocks.map((item) => (
        <li key={item.id} className="mt-content-element first:mt-0">
          {richTextBlock(item)}
          {parseBlocks(item.children, assets)}
        </li>
      ))}
    </Tag>
  );
};

export default parseListItem;
