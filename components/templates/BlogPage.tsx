import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from "react-intersection-observer";
import { Post } from "../../lib/post";
import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import { FiLock } from "react-icons/fi";

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

  return (
    <>
      <header
        ref={ref}
        className="bg-custom-neutral-900 text-white w-full z-10"
      >
        <div className="content-container p-header">
          <div className="grid grid-cols-12 gap-8">
            <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">
              Blog
            </h1>
            <div className="col-span-12 md:col-span-8 self-end">
              <p className="font-display text-2xl font-medium opacity-0 animation-delay-200 animate-slide-in-fast">
                A collection of my unorganized musings
              </p>
            </div>
          </div>
        </div>
      </header>
      <div>
        <div className="content-container p-content flex flex-col flex-gap-y-10">
          {posts.map((post) => {
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
                <p className="mt-2 text-base text-gray-500">
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
            const Tag = post.meta.protected ? Fragment : Link;
            return post.meta.protected ? (
              <Fragment key={post.slug}>{inner}</Fragment>
            ) : (
              <Link
                href={`blog/${post.slug}`}
                key={post.slug}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
