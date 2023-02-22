import React, { Fragment } from "react";

import { Post } from "../../../lib/blog";
// import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "../../atoms/Tag";
import clsx from "clsx";
import Balancer from "react-wrap-balancer";
type PostItemProps = {
  post: Post;
  className?: string;
};
const PostItem = ({ post, className = "" }: PostItemProps) => {
  const inner = (
    <a
      className={clsx(
        "-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex flex-col",
        {
          "cursor-not-allowed": post.meta.protected,
        },
        className
      )}
    >
      <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:gap-y-4 md:grid-cols-12">
        <p
          className={clsx("text-sm md:text-base mt-1 muted-text col-span-3 row-start-2 md:row-start-auto")}
        >
          {post.meta.date &&
            new Date(post.meta.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </p>
        <div className="col-span-9 md:pr-24">
          <div
            className={clsx("flex space-x-2 flex-wrap items-start")}
          >
            {post.meta.tags.map((tag, i) => (
              <Tag key={`tag-${i}`}>{tag}</Tag>
            ))}
          </div>
          <h2
            className={clsx("flex items-start space-x-3 h3 mt-4")}
          >
            <Balancer ratio={0.67}>{post.meta.title}</Balancer>
            {post.meta.protected && <FiLock className="text-gray-400"></FiLock>}
          </h2>
       
          
          <Balancer ratio={0.3}><p className="mt-2 md:mt-3 body-text text-gray-700">{post.meta.excerpt}</p></Balancer>
        </div>
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
export default PostItem;
