import Tag from "@atoms/Tag";
import { Post } from "@lib/notion";
import { formatPostDate } from "@lib/utils/format";
import clsx from "clsx";
import Link from "next/link";
import { FiLock } from "react-icons/fi";

type MiniPostCardProps = {
  post: Post;
  className?: string;
};

const MiniPostCard = ({ post, className = "" }: MiniPostCardProps) => {
  const formattedDate = formatPostDate(post.date);
  return (
    <Link
      href={`/blog/${post.slug}`}
      key={post.slug}
      className={clsx(
        "ease -m-4 flex rounded-lg p-4 transition-all duration-100 group-first/post:mt-0 group-last/post:mb-0 hover:bg-gray-100",
        className,
      )}
    >
      <span className="mr-4 shrink-0 grow-0 text-xl md:text-xl">
        {post.icon && post.icon.type == "emoji" ? post.icon.emoji : null}
      </span>
      <div className="flex flex-col">
        <h5
          className={clsx(
            "inline-flex grow space-x-3 font-sans text-base font-semibold md:text-lg",
          )}
        >
          <span className="">{post.title}</span>
          {post.protected && (
            <FiLock className="text-tertiary mt-1 shrink-0 grow-0"></FiLock>
          )}
        </h5>
        <div className={clsx("mt-3 flex flex-wrap items-start space-x-2")}>
          {post.tags.map((tag, i) => (
            <Tag key={`tag-${i}`}>{tag}</Tag>
          ))}
        </div>
        {formattedDate && (
          <p className={clsx("muted-text mt-2")}>Posted on {formattedDate}</p>
        )}
      </div>
    </Link>
  );
};

export default MiniPostCard;
