import React, {  Fragment } from "react";

import {Post} from '../../lib/blog'
// import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import { FiLock } from "react-icons/fi";
import Tag from "../atoms/Tag";
import classNames from "classnames";
import Balancer from 'react-wrap-balancer';
type PostItemProps = {
    post: Post,
    small?: boolean,
    className?: string
}
const PostItem = ({post, small, className = ''}:PostItemProps) => {
  const TitleTag = small ? 'h5' : 'h2';
  const inner = (
    <a
      className={classNames(
        '-m-4 rounded-lg p-4 transition-all duration-100 ease hover:bg-gray-100 flex flex-col', {
        "cursor-not-allowed": post.meta.protected,
        }, className)
      }
    >
      <TitleTag className={classNames('flex items-start space-x-3', {'h3': !small, 'text-base md:text-xl font-semibold': small, 'flex-grow': small})}>
        <Balancer ratio={0.67}>
        {post.meta.title}
        </Balancer>
        {post.meta.protected && (
          <FiLock className="text-gray-400"></FiLock>
        )}
      </TitleTag>
      <div className={classNames('flex space-x-2 mt-3 flex-wrap items-start')}>{post.meta.tags.map((tag, i) => <Tag key={`tag-${i}`}>{tag}</Tag>)}</div>
      <p className={classNames('mt-2 muted-text', {'text-sm': small})}>
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
    <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
      {inner}
    </Link>
  );
}
export default PostItem