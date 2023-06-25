import React, { Fragment } from "react";
import { Post } from "../../../lib/blog";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "../../atoms/Tag";
import clsx from "clsx";
import Balancer from "react-wrap-balancer";
type SmallPostItemProps = {
  post: Post;
  className?: string;
};
export const SmallPostItem = ({ post, className = "" }: SmallPostItemProps) => {
  const inner = (
    <a
      className={clsx(
        "-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex",
        {
          "cursor-not-allowed": post.meta.protected,
        },
        className
      )}
    >
      <span className="mr-4 text-xl md:text-2xl grow-0 shrink-0">
        {post.meta.icon && post.meta.icon.type == "emoji"
          ? post.meta.icon.emoji
          : null}
      </span>
      <div className="flex flex-col">
        <h5
          className={clsx(
            "flex items-start space-x-3 text-base md:text-xl font-semibold flex-grow"
          )}
        >
          <Balancer ratio={0.67}>{post.meta.title}</Balancer>
          {post.meta.protected && <FiLock className="text-gray-400"></FiLock>}
        </h5>
        <div className={clsx("flex space-x-2 mt-3 flex-wrap items-start")}>
          {post.meta.tags.map((tag, i) => (
            <Tag key={`tag-${i}`}>{tag}</Tag>
          ))}
        </div>
        <p className={clsx("mt-2 muted-text text-sm")}>
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
  return post.meta.protected ? (
    <Fragment key={post.slug}>{inner}</Fragment>
  ) : (
    <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
};
const OtherPostList = ({ posts, post }: { post: Post; posts: Post[] }) => {
  return (
    <>
      <h3 className="sub-heading">Other posts</h3>
      <div className="grid grid-cols-1 gap-6 mt-6 md:mt-2 md:grid-cols-2 md:gap-0 md:-mx-6 group">
        {posts
          .filter((postItem) => postItem.slug != post.slug)
          .map((postItem) => (
            <div
              className="flex flex-col border-gray-200 md:odd:border-r md:px-6 md:py-4 "
              key={postItem.id}
            >
              <SmallPostItem post={postItem} className="flex-grow" />
            </div>
          ))}
      </div>
    </>
  );
};
export default OtherPostList;
