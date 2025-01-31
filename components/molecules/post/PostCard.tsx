import React, { Fragment } from "react";
import { Post } from "@lib/notion";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "@atoms/Tag";
import clsx from "clsx";
import Balancer from "react-wrap-balancer";
import { cn } from "@lib/utils/cn";

type PostCardProps = {
  post: Post;
  className?: string;
  layout?: "horizontal" | "vertical";
};

const PostCard = ({
  post,
  className = "",
  layout = "horizontal",
}: PostCardProps) => {
  const inner = (
    <a
      className={clsx(
        "-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex flex-col",

        className
      )}
    >
      <div
        className={cn(
          layout == "horizontal"
            ? "grid grid-cols-1 gap-x-3 gap-y-3 md:gap-y-4 md:grid-cols-12"
            : "flex gap-3 flex-col"
        )}
      >
        <div className="col-span-3 row-start-2 md:row-start-auto">
          <aside className="flex flex-col gap-2 pl-10 font-mono text-xl md:pl-0">
            <p className={clsx("mt-1 muted-text ")}>
              {post.meta.date &&
                new Date(post.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </aside>
        </div>
        <div className="flex col-span-9 lg:pr-24">
          <span className="mr-4 -mt-1 text-2xl md:mr-6 md:text-3xl grow-0 shrink-0">
            {post.meta.icon && post.meta.icon.type == "emoji"
              ? post.meta.icon.emoji
              : null}
          </span>
          <div className="grow">
            <h2 className={clsx("flex items-start space-x-3 h4")}>
              <Balancer ratio={0.67}>{post.meta.title}</Balancer>
              {post.meta.protected && (
                <FiLock className="mt-1 text-tertiary"></FiLock>
              )}
            </h2>

            <Balancer ratio={0.3}>
              <p className="mt-2 font-mono leading-relaxed tracking-tight text-secondary md:mt-3">
                {post.meta.excerpt}
              </p>
            </Balancer>
            <div className={clsx("flex space-x-2 flex-wrap items-start mt-4")}>
              {post.meta.tags.map((tag, i) => (
                <Tag key={`tag-${i}`}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
  return (
    <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
};

export default PostCard;
