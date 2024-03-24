import ExternalLink from "@atoms/ExternalLink";
import { richTextObject } from "./richText";
const Bookmark = ({ block }) => {
  return (
    <div>
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
          <p className="text-xs text-secondary mt-1">
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
        <p className="mt-2 text-secondary">
          {richTextObject(block.bookmark.caption, block.id)}
        </p>
      ) : null}
    </div>
  );
};
export default Bookmark;
