import ExternalLink from "@atoms/ExternalLink";
import { richTextObject } from "./richText";
import { EnhancedBookmarkBlock } from "@lib/notion/helpers";

type BookmarkProps = {
  block: EnhancedBookmarkBlock;
};

const Bookmark = ({ block }: BookmarkProps) => {
  return (
    <div>
      <ExternalLink
        href={block.bookmark.url}
        className="mt-4 block rounded-md border border-gray-200 px-4 py-3 text-sm hover:bg-gray-100"
      >
        {block.bookmark.meta?.image &&
          block.bookmark.meta.image !== block.bookmark.meta.icon && (
            <div
              className="round-sm inline-block h-40 w-full self-start bg-cover bg-center"
              style={{ backgroundImage: `url(${block.bookmark.meta.image})` }}
            />
          )}

        {(block.bookmark.meta?.title || block.bookmark.url) && (
          <p className="mt-1 flex w-full min-w-0 shrink items-center gap-x-2 text-xs">
            {block.bookmark.meta?.icon && (
              <img
                src={block.bookmark.meta.icon}
                width="24"
                height="24"
                alt=""
                className="inline-block self-start"
              />
            )}
            <p className="text-primary mt-0! text-base font-medium">
              {block.bookmark.meta?.title
                ? block.bookmark.meta.title
                : block.bookmark.url}
            </p>
            {/* <span className="w-full min-w-0 shrink truncate text-sm">
              {block.bookmark.url}
            </span> */}
          </p>
        )}
        {block.bookmark.meta?.description ? (
          <p className="text-secondary mt-1! pl-8 text-xs">
            {block.bookmark.meta.description}
          </p>
        ) : null}
      </ExternalLink>
      {block.bookmark.caption ? (
        <p className="text-secondary mt-2">
          {richTextObject(block.bookmark.caption, block.id)}
        </p>
      ) : null}
    </div>
  );
};
export default Bookmark;
