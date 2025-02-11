import { Post } from "@lib/notion";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "@atoms/Tag";
import clsx from "clsx";

type MiniPostCardProps = {
  post: Post;
  className?: string;
};

const MiniPostCard = ({ post, className = "" }: MiniPostCardProps) => {
  const inner = (
    <a
      className={clsx(
        "-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex",
        className
      )}
    >
      <span className="mr-4 text-xl md:text-xl grow-0 shrink-0">
        {post.meta.icon && post.meta.icon.type == "emoji"
          ? post.meta.icon.emoji
          : null}
      </span>
      <div className="flex flex-col">
        <h5
          className={clsx(
            "grow inline-flex font-sans space-x-3 text-base md:text-lg font-semibold "
          )}
        >
          <span className="">{post.meta.title}</span>
          {post.meta.protected && (
            <FiLock className="mt-1 text-tertiary shrink-0 grow-0"></FiLock>
          )}
        </h5>
        <div className={clsx("flex space-x-2 mt-3 flex-wrap items-start")}>
          {post.meta.tags.map((tag, i) => (
            <Tag key={`tag-${i}`}>{tag}</Tag>
          ))}
        </div>
        <p className={clsx("mt-2 muted-text")}>
          Posted on{" "}
          {post.meta.date &&
            new Date(post.meta.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </p>
      </div>
    </a>
  );
  return (
    <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
};

export default MiniPostCard;
