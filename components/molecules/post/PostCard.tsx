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
  return (
    <Link
      href={`/blog/${post.slug}`}
      key={post.slug}
      className={clsx(
        "ease -m-4 flex flex-col rounded-lg p-4 transition-all duration-100 hover:bg-gray-100",

        className,
      )}
    >
      <div
        className={cn(
          layout == "horizontal"
            ? "grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-12 md:gap-y-4"
            : "flex flex-col gap-3",
        )}
      >
        <div className="col-span-3 row-start-2 md:row-start-auto">
          <aside className="flex flex-col gap-2 pl-10 font-mono text-xl md:pl-0">
            <p className={clsx("muted-text mt-1")}>
              {post.meta.date &&
                new Date(post.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </aside>
        </div>
        <div className="col-span-9 flex lg:pr-24">
          <span className="-mt-1 mr-4 shrink-0 grow-0 text-2xl md:mr-6 md:text-3xl">
            {post.meta.icon && post.meta.icon.type == "emoji"
              ? post.meta.icon.emoji
              : null}
          </span>
          <div className="grow">
            <h2 className={clsx("h4 flex items-start space-x-3")}>
              <Balancer ratio={0.67}>{post.meta.title}</Balancer>
              {post.meta.protected && (
                <FiLock className="text-tertiary mt-1"></FiLock>
              )}
            </h2>

            <p className="text-secondary mt-2 font-mono leading-relaxed tracking-tight md:mt-3">
              <Balancer ratio={0.3}>{post.meta.excerpt}</Balancer>
            </p>
            <div className={clsx("mt-4 flex flex-wrap items-start space-x-2")}>
              {post.meta.tags.map((tag, i) => (
                <Tag key={`tag-${i}`}>{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
