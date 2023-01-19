import React from "react";

import { Post } from "../../lib/blog";
import PostItem from "../molecules/PostItem";
import useHeaderInView from "../../hooks/useHeaderInView";
import ContentMenu from "../molecules/ContentMenu";

export default function BlogPage({ posts }: { posts: Post[] }) {
  const { ref } = useHeaderInView();

  return <>
    <header
      ref={ref}
      className="bg-custom-neutral-900 text-white w-full z-10"
    >
      <div className="content-container p-header">
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">
            Blog
          </h1>
          <div className="col-span-12 md:col-span-8 self-end">
            <p className="text-base md:text-2xl opacity-0 animation-delay-100 animate-slide-in-fast">
              A collection of my unorganized musings
            </p>
          </div>
        </div>
      </div>
    </header>
    <div className="">
      <div className="content-container p-content flex flex-col opacity-0 animate-fade-in-fast delay-200">
        {posts.map((post, i) => {
          return (
            <div key={post.id}>
            <PostItem post={post} />
            {i != posts.length - 1 && <div className="my-6 md:my-8 border-b border-dashed border-gray-300"></div>}
            </div>
          )
        })}
      </div>
    </div>
  </>;
}
