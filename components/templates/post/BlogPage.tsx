import { Post } from "@lib/notion";
import PostListItem from "./PostListItem";
import useHeaderInView from "@hooks/useHeaderInView";
import Footer from "@molecules/Footer";
import Fade from "@atoms/Fade";

export default function BlogPage({ posts }: { posts: Post[] }) {
  const { ref } = useHeaderInView();

  return (
    <>
      <header ref={ref} className="z-10 w-full text-primary bg-surface ">
        <div className="pt-20 pb-8 border-b main-container md:pt-24 md:pb-10 lg:pt-28 lg:pb-12 border-divider">
          <div className="grid grid-cols-12 gap-2 md:gap-4">
            <Fade
              as="h1"
              className="col-span-12 md:col-span-8"
              slide
              duration={100}
            >
              Blog
            </Fade>
            <div className="self-end col-span-12 md:col-span-8">
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
        <div className="flex flex-col main-container py-section-vertical">
          {posts.map((post, i) => {
            return (
              <Fade delay={70 * (i + 1)} key={post.id}>
                <PostListItem post={post} />
                {i != posts.length - 1 && <div className="mt-10 md:mt-16" />}
                {/* {i != posts.length - 1 && <div className="my-6 border-b border-gray-300 border-dashed md:my-8"></div>} */}
              </Fade>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}
