import { richTextBlock, richTextObject } from "./richText";
import { parseCallout } from "./callout";
import Heading from "./Heading";
import Bookmark from "./Bookmark";
import Disclosure from "@atoms/Disclosure";
import parseListItem from "./parseListItem";
import CustomImage from "@atoms/CustomImage";
import { NotionAssets } from "@lib/notion";
import Figure from "@atoms/Figure";
import CustomVideo from "@atoms/CustomVideo";
import Code from "@atoms/Code";

const parseBlocks = (blocks: unknown, assets?: NotionAssets) => {
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
            </p>,
          );
        break;
      case "image":
        content.push(
          <div key={block.id} className="mt-content-node flex flex-col">
            <Figure
              caption={
                block.image.caption && block.image?.caption.length > 0
                  ? richTextObject(block.image.caption, block.id)
                  : ""
              }
              borderRadius={false}
            >
              <CustomImage
                className="max-w-full text-center"
                src={block.image.url}
                // src={`/api/notion-asset/block/${block.id}`}
                alt={block.image.alt ? block.image.alt : "Post Content Image"}
                width={block.image.width}
                height={block.image.height}
              />
            </Figure>
          </div>,
        );
        break;
      case "quote":
        content.push(
          <blockquote
            key={block.id}
            className="mt-content-node border-l-2 border-gray-300 pl-4"
          >
            <p className="body-text mt-content-node">{richTextBlock(block)}</p>
            {parseBlocks(block.children, assets)}
          </blockquote>,
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
            {block.children && parseBlocks(block.children, assets)}
          </Disclosure>,
        );
        break;
      case "bulleted_list_item":
        const bulletedList = parseListItem(
          "bulleted_list_item",
          block,
          blocks,
          lastBlockIndex,
          assets,
        );
        if (bulletedList) content.push(bulletedList);
        break;
      case "numbered_list_item":
        const numberedList = parseListItem(
          "numbered_list_item",
          block,
          blocks,
          lastBlockIndex,
          assets,
        );
        if (numberedList) content.push(numberedList);
        break;
      // using callout as a container
      case "callout":
        content.push(parseCallout(block, blocks, lastBlockIndex, assets));
        break;
      case "video":
        content.push(
          <Figure
            caption={
              block.video.caption && block.video?.caption.length > 0
                ? richTextObject(block.video.caption, block.id)
                : ""
            }
            key={block.id}
            className="mt-content-node"
          >
            <CustomVideo
              src={block.video.url}
              width={block.video.width}
              height={block.video.height}
              autoPlay
            />
          </Figure>,
        );
        break;
      case "embed":
        // Extract dimensions from caption pattern [width-height] Description
        let embedWidth: number | null = null;
        let embedHeight: number | null = null;
        let embedCaption = "";

        if (block.embed.caption && block.embed.caption.length > 0) {
          const captionText = block.embed.caption
            .map((r) => r.plain_text)
            .join("");
          const dimensionMatch = captionText.match(/^\[(\d+)-(\d+)\]\s*/);

          if (dimensionMatch) {
            embedWidth = parseInt(dimensionMatch[1]);
            embedHeight = parseInt(dimensionMatch[2]);
            // Strip the dimension pattern from caption
            const cleanedCaption = captionText.replace(
              /^\[(\d+)-(\d+)\]\s*/,
              "",
            );
            if (cleanedCaption) {
              embedCaption = cleanedCaption;
            }
          } else {
            embedCaption = captionText;
          }
        }

        if (block.embed.url.includes("facebook.com")) {
          content.push(
            <div key={block.id} className="mt-content-node">
              <iframe
                src={`https://www.facebook.com/plugins/post.php?href=${block.embed.url}&width=auto&height=675&show_text=false&appId`}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="h-[675px] w-full overflow-y-scroll"
              ></iframe>
            </div>,
          );
        } else {
          const embedElement = (
            <iframe
              src={block.embed.url}
              className="w-full overflow-hidden rounded-md border-0"
              style={{
                aspectRatio:
                  embedWidth && embedHeight
                    ? `${embedWidth}/${embedHeight}`
                    : undefined,
              }}
              title={embedCaption || "Embedded content"}
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
          );

          if (embedCaption) {
            content.push(
              <Figure
                key={block.id}
                caption={embedCaption}
                className="mt-content-node"
              >
                {embedElement}
              </Figure>,
            );
          } else {
            content.push(
              <div key={block.id} className="mt-content-node">
                {embedElement}
              </div>,
            );
          }
        }
        break;
      case "code":
        content.push(
          <Code
            language={block.code.language}
            key={block.id}
            className="mt-content-node"
          >
            {block.code.rich_text.map((r) => r.plain_text).join("")}
          </Code>,
        );
        break;
      case "column_list":
        content.push(
          <div
            key={block.id}
            className="full mt-content-node flex flex-col gap-8 md:flex-row"
          >
            {block.children.map((column) => (
              <div
                key={column.id}
                className="grow basis-0 [&>*:first-child]:mt-0"
              >
                {column.children && parseBlocks(column.children, assets)}
              </div>
            ))}
          </div>,
        );
        break;
      case "column":
        content.push(
          <div key={block.id} className="">
            {block.children && parseBlocks(block.children, assets)}
          </div>,
        );
        break;
      default:
        break;
    }
    lastBlockIndex.value++;
  }
  return content;
};

export default parseBlocks;
