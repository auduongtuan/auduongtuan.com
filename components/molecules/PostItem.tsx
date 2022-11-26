import React, {  Fragment } from "react";

import {Post} from '../../lib/blog'
// import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "../atoms/Tag";
type PostItemProps = {
    post: Post
}
const PostItem = ({post}:PostItemProps) => {
  const inner = (
    <a
      className={`-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 ${
        post.meta.protected && "cursor-not-allowed"
      }`}
    >
      <h2 className="h3 flex items-center space-x-3">
        <span>{post.meta.title}</span>
        {post.meta.protected && (
          <FiLock className="text-gray-400"></FiLock>
        )}
      </h2>
      <div className="flex space-x-2 mt-2 flex-wrap">{post.meta.tags.map((tag, i) => <Tag key={`tag-${i}`}>{tag}</Tag>)}</div>
      <p className="mt-2 muted-text">
        Posted on{" "}
        {post.meta.date &&
          new Date(post.meta.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
      </p>
    </a>
  );
  const DisplayComponent = post.meta.protected ? Fragment : Link;
  return post.meta.protected ? (
    <Fragment key={post.slug}>{inner}</Fragment>
  ) : (
    <Link href={`blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
}
export default PostItem