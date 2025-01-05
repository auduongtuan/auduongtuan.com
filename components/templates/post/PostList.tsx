import React from "react";
import { Post } from "@lib/notion";
import PostCard from "@molecules/post/PostCard";
export type PostListProps = {
  posts: Post[];
};
export default function PostList({ posts }: PostListProps) {
  return (
    <section>
      <div className="main-container">
        <h2>Blog</h2>
        {posts.map((post, i) => (
          <PostCard post={post} key={i} />
        ))}
      </div>
    </section>
  );
}
