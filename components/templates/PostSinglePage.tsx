import { useEffect } from "react";
import { Post } from "../../lib/post";
import { MDXRemote } from "next-mdx-remote";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from "react-intersection-observer";
import HeadMeta from "../atoms/HeadMeta";

type PostSinglePageProps = {
  post: Post;
};
const components = (slug: string) => ({
  h2: ({ children }) => {
    return <h2 className="text-2xl">{children}</h2>;
  },
});
const PostSinglePage = ({ post }: PostSinglePageProps) => {
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
      <HeadMeta title={post.meta.title} />
      <header
        ref={ref}
        className="bg-custom-neutral-900 text-white w-full z-10"
      >
        <div className="content-container p-header">
          <div className="grid grid-cols-12 gap-4 max-w-[45rem] mx-auto">
            <h1 className="text-5xl col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">
              {post.meta.title}
            </h1>
            <p className="text-base text-gray-300 col-span-12">
              Posted on{" "}
              {post.meta.date &&
                new Date(post.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </div>
        </div>
      </header>
      <div>
        <div className="content-container p-content content">
          
          <div className="max-w-[45rem] mx-auto">
            <MDXRemote
              {...post.parsedContent}
              components={components(post.slug)}
            />
          </div>
         
        </div>
      </div>
    </>
  );
};
export default PostSinglePage;
