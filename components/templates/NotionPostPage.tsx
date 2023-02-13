import { Post } from "../../lib/blog";
import HeadMeta from "../atoms/HeadMeta";
import ReactionAndComment from "../molecules/ReactionAndComment";
import useHeaderInView from "../../hooks/useHeaderInView";
import Balancer from "react-wrap-balancer";
import ContentMenu from "../molecules/ContentMenu";
import Tag from "../atoms/Tag";
import parseBlocks from "../notion/parseBlocks";
import PostItem from "../molecules/PostItem";
const PostSinglePage = ({ post, postContent, posts }) => {
  const { ref } = useHeaderInView();
  return (
    <>
      <HeadMeta title={post.meta.title} />
      <header
        ref={ref}
        className="bg-custom-neutral-900 text-white w-full z-10"
      >
        <div className="content-container p-header">
          <div className="grid grid-cols-1 gap-2 md:gap-4 max-w-[56rem] mx-auto">
            <Balancer>
              <h1 className="text-2xl md:text-3xl leading-tight md:leading-tight lg:text-5xl lg:leading-tight col-span-1  opacity-0 animate-slide-in-fast">
                {post.meta.title}
              </h1>
            </Balancer>
            <div className="flex space-x-2 mt-2 flex-wrap opacity-0 animate-fade-in-fast delay-200">
              {post.meta.tags.map((tag, i) => (
                <Tag key={`tag-${i}`} inverted>
                  {tag}
                </Tag>
              ))}
            </div>
            <p className="muted-text mt-1 text-gray-500 opacity-0 animate-fade-in-fast delay-200">
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
        <div className="relative opacity-0 animate-fade-in-fast delay-200">
          <ContentMenu />
          <div className="content-container p-content blog-content">
            <div className="max-w-[56rem] mx-auto">
              <div className="text-gray-800">{parseBlocks(postContent)}</div>
            </div>
          </div>
        </div>
        <div className=" bg-gray-200 p-content space-y-8">
          <div className="main-container">
            <ReactionAndComment
              page={`blog/${post.slug}`}
              wording={{
                singular: "thought",
                plural: "thoughts",
                title: "Share your thoughts",
                cta: "Or wanna share your thoughts?",
                placeholder: "Hmmm... I think..."
              }
            }
            ></ReactionAndComment>
          </div>
        </div>
        <div className="p-content  relative">
        <section className="main-container">
          <h3 className="sub-heading">Other posts</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 md:-mx-6 group">
            {posts
              .filter((postItem) => postItem.slug != post.slug)
              .map((postItem, i) => (
                <div className="md:odd:border-r border-gray-300 flex flex-col md:px-6 " key={postItem.id}>
                  <PostItem post={postItem} small className="flex-grow" />
                  
                </div>
              ))}
          </div>
        </section>
        </div>
      </div>
    </>
  );
};
export default PostSinglePage;
