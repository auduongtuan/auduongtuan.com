import { Post } from "@lib/notion";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "@atoms/Tag";
import clsx from "clsx";
import { formatPostDate } from "@lib/utils/format";

type MiniPostCardProps = {
  post: Post;
  className?: string;
};

const MiniPostCard = ({ post, className = "" }: MiniPostCardProps) => {
  const formattedDate = formatPostDate(post.meta.date);
  return (
    <Link
      href={`/blog/${post.slug}`}
      key={post.slug}
      className={clsx(
        "ease -m-4 flex rounded-lg p-4 transition-all duration-100 hover:bg-gray-100",
        className,
      )}
    >
      <span className="mr-4 shrink-0 grow-0 text-xl md:text-xl">
        {post.meta.icon && post.meta.icon.type == "emoji"
          ? post.meta.icon.emoji
          : null}
      </span>
      <div className="flex flex-col">
        <h5
          className={clsx(
            "inline-flex grow space-x-3 font-sans text-base font-semibold md:text-lg",
          )}
        >
          <span className="">{post.meta.title}</span>
          {post.meta.protected && (
            <FiLock className="text-tertiary mt-1 shrink-0 grow-0"></FiLock>
          )}
        </h5>
        <div className={clsx("mt-3 flex flex-wrap items-start space-x-2")}>
          {post.meta.tags.map((tag, i) => (
            <Tag key={`tag-${i}`}>{tag}</Tag>
          ))}
        </div>
        {formattedDate && (
          <p className={clsx("muted-text mt-2")}>
            Posted on {formattedDate}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MiniPostCard;
