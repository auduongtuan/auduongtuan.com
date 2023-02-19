import React from "react";

import { Post } from "../../../lib/blog";
import PostItem from "./PostItem";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Footer from "../../molecules/Footer";
import Fade, {FadeProps} from "../../atoms/transition";
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
            <p className="text-base md:text-xl leading-relaxed opacity-0 animation-delay-100 animate-fade-in-fast">
              A collection of my unorganized musings
            </p>
          </div>
        </div>
      </div>
    </header>
    <section className="">
      <div className="content-container p-content flex flex-col">
        {posts.map((post, i) => {
          return (
            <Fade appear={true} unmount={true} delay={50*(i+1) as FadeProps['delay']} key={post.id}>
            <PostItem post={post} />
            {i != posts.length - 1 && <div className="mt-10 md:mt-16" />}
            {/* {i != posts.length - 1 && <div className="my-6 md:my-8 border-b border-dashed border-gray-300"></div>} */}
            </Fade>
          )
        })}
      </div>
    </section>
    <Footer />
  </>;
}