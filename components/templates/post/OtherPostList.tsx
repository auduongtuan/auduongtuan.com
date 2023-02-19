import React, {  Fragment } from "react";

import {Post} from '../../../lib/blog'
// import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "../../atoms/Tag";
import classNames from "classnames";
import Balancer from 'react-wrap-balancer';
type SmallPostItemProps = {
    post: Post,
    className?: string
}
export const SmallPostItem = ({post, className = ''}: SmallPostItemProps) => {
  const inner = (
    <a
      className={classNames(
        '-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex flex-col', {
        "cursor-not-allowed": post.meta.protected,
        }, className)
      }
    >
      <h5 className={classNames('flex items-start space-x-3 text-base md:text-xl font-semibold flex-grow')}>
        <Balancer ratio={0.67}>
        {post.meta.title}
        </Balancer>
        {post.meta.protected && (
          <FiLock className="text-gray-400"></FiLock>
        )}
      </h5>
      <div className={classNames('flex space-x-2 mt-3 flex-wrap items-start')}>{post.meta.tags.map((tag, i) => <Tag key={`tag-${i}`}>{tag}</Tag>)}</div>
      <p className={classNames('mt-2 muted-text text-sm')}>
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
  return post.meta.protected ? (
    <Fragment key={post.slug}>{inner}</Fragment>
  ) : (
    <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
}
const OtherPostList = ({posts, post}: {post: Post, posts:Post[]}) => {
  return (
    <>
    <h3 className="sub-heading">Other posts</h3>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 md:-mx-6 group">
      {posts
        .filter((postItem) => postItem.slug != post.slug)
        .map((postItem) => (
          <div className="md:odd:border-r border-gray-200 flex flex-col md:px-6 " key={postItem.id}>
            <SmallPostItem post={postItem} className="flex-grow" />
            
          </div>
        ))}
    </div>
    </>
  )
}
export default OtherPostList;