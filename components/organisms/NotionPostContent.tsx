import Image from "next/image";
import Link from "next/link";
import ExternalLink from "../atoms/ExternalLink";
import Balancer from 'react-wrap-balancer';
import { Fragment } from "react";

const escapedNewLineToLineBreakTag = (string) => {
  return string.split('\n').map((item, index) => {
    return (index === 0) ? item : [<br key={index} />, item]
  })
}
const richTextObject = (richTextObject, blockId?: string) => {
  return richTextObject.map((item, i) => {    
    if (item.type == "text" && item.text.link == null) {
      if(item.annotations.bold) {
        return <strong className="font-medium" key={`${blockId}-${i}`}>{escapedNewLineToLineBreakTag(item.text.content)}</strong>
      } else {
        return <span key={`${blockId}-${i}`}>{escapedNewLineToLineBreakTag(item.text.content)}</span>
      }
    } else if (item.text.link) {
      let checkInternal = item.text.link.url.match(/auduongtuan\.com\/(.*?)$/i);
      if (checkInternal) {
        return (
          <Link
            key={`${blockId}-${i}`}
            href={`/${checkInternal[1]}/`}
            className={`text-slate-600 underline underline-offset-4 decoration-gray-400 decoration-1 hover:text-blue-800 hover:decoration-blue-800 ${item.annotations.bold ? 'font-semibold' : ''}`}
          >
            {item.text.content}
          </Link>
        );
      } else {
        return (
          <ExternalLink
            key={`${blockId}-${i}`}
            href={item.text.link.url}
            className={`text-slate-600 underline underline-offset-4 decoration-gray-400 decoration-1 hover:text-blue-800 hover:decoration-blue-800 ${item.annotations.bold ? 'font-medium' : ''}`}
          >
            {item.text.content}
          </ExternalLink>
        );
      }
    }
  });
};
const richTextBlock = (block) => {
  if (block[block.type] && block[block.type].rich_text) {
    return richTextObject(block[block.type].rich_text, block.id);
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
            content.push(
              <p key={block.id} className="body-text mt-content-node">
                {richTextBlock(block)}
              </p>
            );
            return content;
          case "image":
            // console.log(block.id);
            content.push(
              <p key={block.id} className="mt-content-node">
                <Image
                  className="max-w-full text-center"
                  // src={block.image.file.url}
                  src={`/api/notion-asset/${block.id}`}
                  alt={block.image.alt ? block.image.alt : "Post Content Image"}
                  width={block.image.width}
                  height={block.image.height}
                />
              </p>
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
            content.push(
              <Balancer key={block.id} as={Fragment}>
              <h2
                className="h3 md:text-4xl font-semibold mt-8 md:mt-12 first:mt-0 text-slate-800"
              >
                {block.heading_2.rich_text[0]?.plain_text}
              </h2>
              </Balancer>
            );
            return content;
          case "heading_3":
            content.push(
              <Balancer key={block.id} as={Fragment}>
              <h3
                className="text-base md:text-2xl font-semibold mt-4 md:mt-8 text-slate-800"
              >
                {block.heading_3.rich_text[0]?.plain_text}
              </h3>
              </Balancer>
            );
            return content;
          case "bookmark":
            content.push(
              <div key={block.id}>
                <ExternalLink
                  href={block.bookmark.url}
                  className="block border border-gray-200 text-sm py-3 px-4 rounded-md mt-4 hover:bg-gray-100"
                >
                  <p className="text-base font-medium text-gray-800">
                    {block.bookmark.meta.title
                      ? block.bookmark.meta.title
                      : block.bookmark.url}
                  </p>
                  {block.bookmark.meta.description ? (
                    <p className="text-xs text-gray-600 mt-1">
                      {block.bookmark.meta.description}
                    </p>
                  ) : null}
                  {block.bookmark.meta.title && (
                    <p className="text-xs mt-1 inline-flex flex-gap-x-2">
                      {/* <img
                        src={block.bookmark.meta.icon}
                        width="16"
                        height="16"
                        alt={block.bookmark.meta.title}
                      /> */}
                      <span>{block.bookmark.url}</span>
                    </p>
                  )}
                </ExternalLink>
                {block.bookmark.caption ? (
                  <p className="mt-2 text-gray-600">
                    {richTextObject(block.bookmark.caption, block.id)}
                  </p>
                ) : null}
              </div>
            );
            return content;
          case "bulleted_list_item":
            if (
              (blockIndex > 0 &&
                blocks[blockIndex - 1].type != "bulleted_list_item") ||
              blockIndex == 0
            ) {
              lastListItemBlockIndex = blockIndex;
              let listItemBlocks: any[] = [];
              while (
                blocks[lastListItemBlockIndex].type == "bulleted_list_item" &&
                lastListItemBlockIndex <= blocks.length - 1
              ) {
                listItemBlocks.push(blocks[lastListItemBlockIndex]);
                lastListItemBlockIndex++;
              }
              content.push(
                <ul className="body-text list-disc mt-3 md:mt-4 pl-8 mt-content-node" key={`list-${block.id}`}>
                  {listItemBlocks.map((item) => (
                    <li key={item.id} className="mt-2 md:mt-3 first:mt-0">
                      {richTextBlock(item)}
                    </li>
                  ))}
                </ul>
              );
            }
            return content;
          case "numbered_list_item":
            if (
              (blockIndex > 0 &&
                blocks[blockIndex - 1].type != "numbered_list_item") ||
              blockIndex == 0
            ) {
              lastListItemBlockIndex = blockIndex;
              let listItemBlocks: any[] = [];
              while (
                blocks[lastListItemBlockIndex].type == "numbered_list_item" &&
                lastListItemBlockIndex <= blocks.length - 1
              ) {
                listItemBlocks.push(blocks[lastListItemBlockIndex]);
                lastListItemBlockIndex++;
              }
              content.push(
                <ol className="body-text mt-content-node" key={`list-${block.id}`}>
                  {listItemBlocks.map((item) => (
                    <li key={item.id} className="mt-2 md:mt-3 first:mt-0">
                      {richTextBlock(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            return content;
          default:
            return content;
        }
      }, [])
    : null;
};
const NotionPostContent = ({ postContent }) => {
  return <div className="text-gray-800">{parseBlocks(postContent)}</div>;
};
export default NotionPostContent;
