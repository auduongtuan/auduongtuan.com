import { Post } from "@lib/notion";
import PostCard from "@molecules/post/PostCard";
import Fade from "@atoms/Fade";

export default function BlogPage({ posts }: { posts: Post[] }) {
  return (
    <>
      <header className="text-primary bg-surface z-10 w-full">
        <div className="main-container py-section-vertical border-divider pb-subsection-vertical border-b">
          <div className="grid grid-cols-12 gap-2 md:gap-4">
            <Fade
              as="h1"
              className="h1 col-span-12 md:col-span-8"
              slide
              duration={100}
            >
              Blog
            </Fade>
            <div className="col-span-12 self-end md:col-span-8">
              <Fade
                as="p"
                className="page-description"
                slide
                duration={200}
                delay={100}
              >
                A collection of my unorganized musings
              </Fade>
            </div>
          </div>
        </div>
      </header>
      <section className="">
        <div className="main-container py-section-vertical flex flex-col">
          {posts.map((post, i) => {
            return (
              <Fade delay={70 * (i + 1)} key={post.id}>
                <PostCard post={post} />
                {i != posts.length - 1 && <div className="mt-10 md:mt-16" />}
                {/* {i != posts.length - 1 && <div className="my-6 border-b border-gray-300 border-dashed md:my-8"></div>} */}
              </Fade>
            );
          })}
        </div>
      </section>
    </>
  );
}
