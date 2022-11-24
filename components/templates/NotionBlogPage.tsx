import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from "react-intersection-observer";

import { Post } from "../../lib/blog";
import PostItem from "../molecules/PostItem";

export default function BlogPage({ posts }: { posts: Post[] }) {
  const appContext = useAppContext();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: "-10px",
  });
  useEffect(() => {
    appContext &&
      appContext.setHeaderInView &&
      appContext.setHeaderInView(inView);
    // console.log(entry);
  }, [inView, appContext]);

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
            <p className="text-base md:text-2xl opacity-0 animation-delay-200 animate-slide-in-fast">
              A collection of my unorganized musings
            </p>
          </div>
        </div>
      </div>
    </header>
    <div className="">
      <div className="content-container p-content flex flex-col flex-gap-y-6 md:flex-gap-y-12 ">
        {posts.map((post) => <PostItem key={post.id} post={post} />)}
      </div>
    </div>
  </>;
}
