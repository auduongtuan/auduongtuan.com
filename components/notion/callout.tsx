import Grid, { Col } from "@atoms/Grid";
import parseBlocks from "./parseBlocks";
import { richTextObject } from "./richText";
import BrowserFrame from "@atoms/Frame";
import {
  BlockObjectResponse,
  CalloutBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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
    const componentWithOptions = block?.callout?.rich_text[0]?.plain_text;
    const parts = componentWithOptions.split(" ");
    const component = parts[0];
    const options = parts
      .splice(1)
      .join(" ")
      .matchAll(/(\w+)=("[^<>"]*"|'[^<>']*'|\w+)/g);
    return [
      component,
      [...options].reduce((acc, m) => {
        acc[m[1]] = trimAny(m[2], [`'`, `"`]);
        return acc;
      }, {}),
    ];
  } else {
    return [undefined, {}];
  }
}
export const parseCallout = (
  block: CalloutBlockObjectResponse,
  blocks: BlockObjectResponse[],
  lastBlockIndex: { value: number }
) => {
  console.log({ lastBlockIndex });
  let rendered: React.ReactElement | null = null;
  let gridBlocks: BlockObjectResponse[] = [];
  while (
    blocks[lastBlockIndex.value] &&
    "type" in blocks[lastBlockIndex.value] &&
    blocks[lastBlockIndex.value].type == "callout" &&
    getCalloutComponentWithOptions(blocks[lastBlockIndex.value])[0] ==
      "grid-item" &&
    lastBlockIndex.value <= blocks.length - 1
  ) {
    gridBlocks.push(blocks[lastBlockIndex.value]);
    lastBlockIndex.value++;
  }
  // give the last item back
  const [component, options] = getCalloutComponentWithOptions(block);
  if ("callout" in block) {
    switch (component) {
      case "browser-frame":
        rendered = (
          <div key={block.id} className="mt-content-node">
            <BrowserFrame mainClassname="[&>*:first-child]:mt-0">
              {"children" in block && parseBlocks(block.children)}
            </BrowserFrame>
          </div>
        );
        break;
      case "grid-item":
        // ony grid-item that we need to take last item back
        lastBlockIndex.value--;
        rendered = (
          <Grid className="mt-content-node">
            {gridBlocks.map((block) => (
              <Col key={block.id} {...getCalloutComponentWithOptions(block)[1]}>
                {block.id}
              </Col>
            ))}
          </Grid>
        );
        break;
      default:
        rendered = (
          <div key={block.id} className="mt-content-node">
            {richTextObject(block.callout?.rich_text)}
            {"children" in block && parseBlocks(block.children)}
          </div>
        );
    }
  }
  return rendered;
};
