import ExternalLink from "@atoms/ExternalLink";
import { richTextObject } from "./richText";
import { EnhancedBookmarkBlock } from "@lib/notion/helpers";
import { cn } from "@lib/utils/cn";

type BookmarkProps = {
  block: EnhancedBookmarkBlock;
};

const Bookmark = ({ block }: BookmarkProps) => {
  const favIcon = (className?: string) =>
    block.bookmark.meta?.icon && (
      <img
        src={block.bookmark.meta.icon}
        width="24"
        height="24"
        alt=""
        className={cn("inline-block self-start", className)}
      />
    );
  return (
    <div className="@container">
      <ExternalLink
        href={block.bookmark.url}
        className="border-divider hover:bg-surface-raised mt-4 flex flex-col gap-4 rounded-md border px-4 py-3 text-sm @lg:flex-row @lg:items-center"
      >
        {block.bookmark.meta?.image &&
          block.bookmark.meta.image !== block.bookmark.meta.icon && (
            <div className="relative inline-block aspect-[1.91] max-h-40 w-full self-start">
              <div
                className="h-full w-full overflow-hidden rounded-sm bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${block.bookmark.meta.image})` }}
              />
              {favIcon("absolute top-2 right-2")}
            </div>
          )}
        <div className="flex flex-col">
          {(block.bookmark.meta?.title || block.bookmark.url) && (
            <div className="flex w-full min-w-0 shrink items-center gap-x-2 text-xs">
              {!block.bookmark.meta?.image && favIcon()}
              <p className="text-primary small-body-text mt-0 font-medium">
                {block.bookmark.meta?.title
                  ? block.bookmark.meta.title
                  : block.bookmark.url}
              </p>
              {/* <span className="w-full min-w-0 shrink truncate text-sm">
              {block.bookmark.url}
            </span> */}
            </div>
          )}
          {block.bookmark.meta?.description ? (
            <p
              className={cn(
                `text-secondary mt-1 line-clamp-2 text-xs`,
                !block.bookmark.meta?.image ? "pl-8" : "",
              )}
            >
              {block.bookmark.meta.description}
            </p>
          ) : null}
        </div>
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
