import React, {useEffect, useState, useCallback} from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from 'react-intersection-observer';
import { Post } from "../../lib/post";
import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
export default function BlogPage({posts}:{posts: Post[]}) {
  const appContext = useAppContext();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: '-10px'
  });
  useEffect(() => {
    appContext && appContext.setHeaderInView && appContext.setHeaderInView(inView)    
    // console.log(entry);
  }, [inView, appContext]);
 
  return (
    <>
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-8">
           <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">Blog</h1>
          <div className="col-span-12 md:col-span-8 self-end">
           
            <p className="font-display big-text opacity-0 animation-delay-200 animate-slide-in-fast">
             A collection of my unorganized musings
            </p>
          </div>
        
        </div>
      </div>
    </header>
    <div>
      <div className="main-container p-content flex flex-col flex-gap-y-10">
      {posts.map(post => 
        <article key={post.slug}>
          <h2><Link href={`blog/${post.slug}`}>{post.meta.title}</Link></h2>
          <p className="mt-2 text-lg text-gray-500">{post.meta.date && (new Date(post.meta.date)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}</p>
        </article>
        )}
      </div>
    </div>
    </>
  );
}
