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
} from "@notionhq/client/build/src/api-endpoints";
import parseBlocks from "./parseBlocks";
import { richTextObject } from "./richText";

function trimAny(str: string, chars: string[]) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0) ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0) --end;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
}

function getCalloutComponentWithOptions(
  block: BlockObjectResponse
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
  assets?: NotionAssets
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
  const [component, options] = getCalloutComponentWithOptions(block);
  const children = "children" in block && parseBlocks(block.children, assets);
  if ("callout" in block) {
    switch (component) {
      case "BrowserFrame":
        rendered = (
          <div key={block.id} className="mt-content-node">
            <BrowserFrame mainClassname="[&>*:first-child]:mt-0">
              {children}
            </BrowserFrame>
          </div>
        );
        break;
      case "Note":
        rendered = (
          <Note key={block.id} className="mt-content-node">
            {children}
          </Note>
        );
        break;
      case "Col":
        // ony grid-item that we need to take last item back
        lastBlockIndex.value--;
        rendered = (
          <Grid key={block.id} className="mt-content-node">
            {gridBlocks.map((gblock) => (
              <Col
                key={gblock.id}
                {...getCalloutComponentWithOptions(gblock)[1]}
              >
                {"children" in gblock && parseBlocks(gblock.children)}
              </Col>
            ))}
          </Grid>
        );
        break;
      case "Box":
        rendered = (
          <Box key={block.id} {...options}>
            {children}
          </Box>
        );
        break;
      case "EmojiBox":
        rendered = (
          <EmojiBox key={block.id} {...options}>
            {children}
          </EmojiBox>
        );
        break;
      case "Figure":
        rendered = (
          <Figure key={block.id} {...options}>
            {children}
          </Figure>
        );
        break;
      case "Asset":
        let asset: false | undefined | NotionMedia | NotionMedia[] =
          assets && options.name in assets && assets[options.id];
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
            {children}
          </div>
        );
        break;
      default:
        rendered = (
          <div key={block.id} className="mt-content-node">
            {richTextObject(block.callout?.rich_text)}
            {children}
          </div>
        );
    }
  }
  return rendered;
};
