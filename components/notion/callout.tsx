import Box, { EmojiBox } from "@atoms/Box";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Figure from "@atoms/Figure";
import BrowserFrame from "@atoms/Frame";
import Grid, { Col } from "@atoms/Grid";
import Note from "@atoms/Note";
import { NotionAssets, NotionMedia } from "@lib/notion";
import { BlockObjectResponseWithChildren } from "@lib/notion/helpers";
import {
  BlockObjectResponse,
  CalloutBlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import parseBlocks from "./parseBlocks";
import { richTextObject } from "./richText";
import { Children } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import IconButton from "@atoms/IconButton";
import Carousel from "@atoms/Carousel";
import Vimeo from "@atoms/Vimeo";
import Persona from "@atoms/Persona";
import { twMerge } from "tailwind-merge";

function trimAny(str: string, chars: string[]) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0) ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0) --end;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
}

function getCalloutComponentWithOptions(
  block: BlockObjectResponse,
): [string | undefined, { [key: string]: string }] {
  if ("callout" in block && "rich_text" in block.callout) {
    const componentWithOptions = block?.callout?.rich_text
      .map((richTextItem) => richTextItem.plain_text)
      .join("");
    if (!componentWithOptions) return [undefined, {}];
    const parts = componentWithOptions.split(" ");
    const component = parts[0];
    const optionPartString = parts.splice(1).join(" ");
    const options = optionPartString
      // .matchAll(/(\w+)=("[^<>"]*"|'[^<>']*'|\w+)/g);
      .matchAll(/(\w+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g);
    let optionsObject: { [key: string]: string } = {};
    [...options].forEach((m) => {
      optionsObject[m[1]] = trimAny(m[2], ['"', "'"]);
    });

    // const optionsObject = [...options].reduce((acc, m) => {
    //   console.log(m[1], m[2]);
    //   acc[m[1]] = m[2];
    //   return acc;
    // }, {});
    return [component, optionsObject];
  } else {
    return [undefined, {}];
  }
}

export const parseCallout = (
  block: BlockObjectResponseWithChildren<CalloutBlockObjectResponse>,
  blocks: BlockObjectResponse[],
  lastBlockIndex: { value: number },
  assets?: NotionAssets,
) => {
  let rendered: React.ReactElement | null = null;
  let gridBlocks: BlockObjectResponseWithChildren[] = [];
  while (
    blocks[lastBlockIndex.value] &&
    "type" in blocks[lastBlockIndex.value] &&
    blocks[lastBlockIndex.value].type == "callout" &&
    getCalloutComponentWithOptions(blocks[lastBlockIndex.value])[0] == "Col" &&
    lastBlockIndex.value <= blocks.length - 1
  ) {
    gridBlocks.push(blocks[lastBlockIndex.value]);
    lastBlockIndex.value++;
  }
  // give the last item back
  const [component, { mt, ...options }] = getCalloutComponentWithOptions(block);
  const parseChildren = () =>
    "children" in block && parseBlocks(block.children, assets);
  if ("callout" in block) {
    switch (component) {
      case "BrowserFrame":
        rendered = (
          <div key={block.id} className={"mt-content-node"}>
            <BrowserFrame mainClassname="[&>*:first-child]:mt-0">
              {parseChildren()}
            </BrowserFrame>
          </div>
        );
        break;
      case "Note":
        rendered = (
          <Note key={block.id} className={"mt-content-node"}>
            {parseChildren()}
          </Note>
        );
        break;
      case "Col":
        // ony grid-item that we need to take last item back
        lastBlockIndex.value--;
        const gridOptionKeys = ["align", "justify", "gap"];
        const gridOptions = Object.fromEntries(
          Object.entries(options).filter(([key]) =>
            gridOptionKeys.includes(key),
          ),
        );

        const colOptions = Object.fromEntries(
          Object.entries(options).filter(
            ([key]) => !gridOptionKeys.includes(key),
          ),
        );
        rendered = (
          <Grid key={block.id} {...gridOptions} className="mt-content-node">
            {gridBlocks.map((gblock) => {
              const { align, justify, gap, ...colOptions } =
                getCalloutComponentWithOptions(gblock)[1];
              return (
                <Col key={gblock.id} {...colOptions}>
                  {"children" in gblock && parseBlocks(gblock.children)}
                </Col>
              );
            })}
          </Grid>
        );
        break;
      case "Box":
        rendered = (
          <Box key={block.id} {...options}>
            {parseChildren()}
          </Box>
        );
        break;
      case "MarginBox":
        rendered = (
          <Box key={block.id} className={"mt-content-node"} {...options}>
            {parseChildren()}
          </Box>
        );
        break;
      case "FullWidth":
        rendered = (
          <div key={block.id} className={"full mt-content-node"} {...options}>
            {parseChildren()}
          </div>
        );
        break;
      case "EmojiBox":
        rendered = (
          <EmojiBox key={block.id} {...options}>
            {parseChildren()}
          </EmojiBox>
        );
        break;
      case "Figure":
        rendered = (
          <Figure key={block.id} {...options}>
            {parseChildren()}
          </Figure>
        );
        break;
      case "Asset":
        let asset: false | undefined | NotionMedia | NotionMedia[] =
          assets && options.id in assets && assets[options.id];
        if (!asset) return;
        const media = Array.isArray(asset) ? asset[0] : asset;
        rendered = (
          <div key={block.id} className="mt-content-node">
            {media.type == "video" && (
              <CustomVideo
                src={media.url}
                width={media.width}
                height={media.height}
              />
            )}
            {media.type == "image" && (
              <CustomImage
                src={media.url}
                width={media.width}
                height={media.height}
              />
            )}
            {parseChildren()}
          </div>
        );
        break;
      case "Slider":
        rendered = (
          <div key={block.id}>
            <Carousel {...options} blockId={block.id}>
              {parseChildren()}
            </Carousel>
          </div>
        );
        break;
      case "Vimeo":
        const { id, ratio, ...otherOptions } = options;
        rendered = (
          <div key={block.id} className="mt-content-node w-full">
            <Vimeo
              id={id}
              ratio={ratio ? Number(ratio) : undefined}
              {...otherOptions}
            />
          </div>
        );
        break;
      case "PersonaBox":
        const { name, ...rest } = options;
        const imageBlock = block.children?.find(
          (block) => block.type == "image",
        ) as any;
        const otherBlocks = imageBlock
          ? block.children?.filter((block) => block.id != imageBlock.id)
          : block.children;
        rendered = (
          <Persona
            key={block.id}
            name={name}
            image={imageBlock?.image?.url}
            imageWidth={imageBlock?.image?.width}
            imageHeight={imageBlock?.image?.height}
            {...rest}
          >
            {"children" in block && parseBlocks(otherBlocks, assets)}
          </Persona>
        );
        break;
      case "Quote":
        rendered = (
          <blockquote
            key={block.id}
            className="mt-content-node text-center text-xl font-semibold"
          >
            {parseChildren()}
          </blockquote>
        );
        break;
      default:
        rendered = block.callout?.rich_text ? (
          <div key={block.id} className="mt-content-node">
            {richTextObject(block.callout?.rich_text)}
            {parseChildren()}
          </div>
        ) : null;
    }
  }
  return rendered;
};
