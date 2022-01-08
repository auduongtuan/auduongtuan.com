import { Post } from "../../lib/post";
import { MDXRemote } from "next-mdx-remote";
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
});
const PostSinglePage = ({ post }: PostSinglePageProps) => (
  <div className="bg-gray-100 h-full min-h-screen	">
    <div className="pt-20 pb-20">
      <article className="ml-auto mr-auto mb-8 last:mb-0 p-4 max-w-4xl bg-white shadow-sm rounded-md">
        <h1>{post.meta.title}</h1>
        <div className="mt-4">
          <MDXRemote
            {...post.parsedContent}
            components={components(post.slug)}
          />
        </div>
      </article>
    </div>
  </div>
);
export default PostSinglePage;
