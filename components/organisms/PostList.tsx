import React from 'react'
import { Post } from "../../lib/post";
import PostItem from "../molecules/PostItem";
export type PostListProps = {
  posts: Post[]
}
export default function PostList({posts}:PostListProps) {
  return (
    <section>
        <div className="main-container">
          <h2>Blog</h2>
          {posts.map((post, i) => (
            <PostItem post={post} key={i} />
          ))}
        </div>
      </section>
  )
}
