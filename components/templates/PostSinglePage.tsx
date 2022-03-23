import { useEffect } from "react";
import { Post } from "../../lib/post";
import { MDXRemote } from "next-mdx-remote";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from 'react-intersection-observer';
type PostSinglePageProps = {
  post: Post;
};
const components = (slug: string) => ({
  // img: ({ src, alt }:{src: string, alt: string}) => {
  //   return (
  //     <div>
  //       <Image
  //         alt={alt}
  //         src={require('../content/posts/uploads/' + src).default}
  //       />
  //     </div>
  //   )
  // }
  h2: ({children}) => {
    return <h2 className="text-2xl">{children}</h2>
  }
});
const PostSinglePage = ({ post }: PostSinglePageProps) => {
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
           <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">{post.meta.title}</h1>

        
        </div>
      </div>
    </header>
    <div>
      <div className="main-container p-content content grid grid-cols-3 gap-6 lg:gap-8">
        <div className="col-span-3 lg:col-span-1">
        <p className="text-base text-gray-500">Posted on {post.meta.date && (new Date(post.meta.date)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}</p>
        </div>
        <div className="col-span-3 lg:col-span-2 lg:col-end-4">
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
