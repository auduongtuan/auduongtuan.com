import Image from "next/image";
import Link from "next/link";
import ExternalLink from "../atoms/ExternalLink";
const richText = (block) => {
  if (block[block.type] && block[block.type].rich_text) {
    return block[block.type].rich_text.map((item, i) => {
      if (item.type == "text" && item.text.link == null) {
        return item.text.content;
      } else if (item.text.link) {
        let checkInternal = item.text.link.url.match(
          /auduongtuan\.com\/(.*?)$/i
        );
        if (checkInternal) {
          return (
            <Link key={`${block.id}-${i}`} href={`/${checkInternal[1]}/`}>
              {item.text.content}
            </Link>
          );
        } else {
          return (
            <ExternalLink key={`${block.id}-${i}`} href={item.text.link.url}>
              {item.text.content}
            </ExternalLink>
          );
        }
      }
    });
  } else {
    return null;
  }
};
const parseBlocks = (blocks: any[]) => {
  return blocks && blocks.length > 0
    ? blocks.reduce((content, block, blockIndex) => {
        let lastListItemBlockIndex: number;
        switch (block.type) {
          case "paragraph":
            content.push(<p key={block.id}>{richText(block)}</p>);
            return content;
          case "image":
            // console.log(block.id);
            content.push(
              <p key={block.id}>
                <Image
                  className="max-w-full text-center"
                  // src={block.image.file.url}
                  src={`/api/notion-asset/${block.id}`}
                  alt={block.image.alt ? block.image.alt : 'Post Content Image'}
                  width={block.image.width}
                  height={block.image.height}
                />
              </p>
            );
            return content;
          case "heading_2":
            content.push(
              <h2 className="h3" key={block.id}>
                {block.heading_2.rich_text[0]?.plain_text}
              </h2>
            );
            return content;
          case "bulleted_list_item":
            if ((blockIndex > 0 && blocks[blockIndex - 1].type != 'bulleted_list_item') || blockIndex == 0) {
              lastListItemBlockIndex = blockIndex;
              let listItemBlocks: any[] = [];
              while(blocks[lastListItemBlockIndex].type == 'bulleted_list_item' && lastListItemBlockIndex <= blocks.length - 1) {
                listItemBlocks.push(blocks[lastListItemBlockIndex]);
                lastListItemBlockIndex++;
              }
              content.push(<ul>{listItemBlocks.map(item => <li key={item.id}>{richText(item)}</li>)}</ul>);
            }
            return content;
          case "numbered_list_item":
              if ((blockIndex > 0 && blocks[blockIndex - 1].type != 'numbered_list_item') || blockIndex == 0) {
                lastListItemBlockIndex = blockIndex;
                let listItemBlocks: any[] = [];
                while(blocks[lastListItemBlockIndex].type == 'numbered_list_item' && lastListItemBlockIndex <= blocks.length - 1) {
                  listItemBlocks.push(blocks[lastListItemBlockIndex]);
                  lastListItemBlockIndex++;
                }
                content.push(<ol>{listItemBlocks.map(item => <li key={item.id}>{richText(item)}</li>)}</ol>);
              }
              return content;
          default:
            return content;
        }
      }, [])
    : null;
};
const NotionPostContent = ({ postContent }) => {
  return parseBlocks(postContent);
};
export default NotionPostContent;
