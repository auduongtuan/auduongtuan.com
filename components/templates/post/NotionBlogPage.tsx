import React from "react";

import { Post } from "../../../lib/blog";
import PostItem from "./PostItem";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Footer from "../../molecules/Footer";
import Fade, {FadeProps} from "../../atoms/Fade";
export default function BlogPage({ posts }: { posts: Post[] }) {
  const { ref } = useHeaderInView();

  return <>
    <header
      ref={ref}
      className="bg-custom-neutral-900 text-white w-full z-10"
    >
      <div className="content-container p-header">
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <Fade as="h1" className="col-span-12 md:col-span-8" slide duration={100}>
            Blog
          </Fade>
          <div className="col-span-12 md:col-span-8 self-end">
            <Fade as="p" className="text-base md:text-xl leading-relaxed" slide duration={200} delay={100}>
              A collection of my unorganized musings
            </Fade>
          </div>
        </div>
      </div>
    </header>
    <section className="">
      <div className="content-container p-content flex flex-col">
        {posts.map((post, i) => {
          return (
            <Fade delay={70*(i+1)} key={post.id}>
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