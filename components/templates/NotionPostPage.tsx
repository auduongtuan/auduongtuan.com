import { Post } from "../../lib/blog";
import HeadMeta from "../atoms/HeadMeta";
import ReactionAndComment from "../molecules/ReactionAndComment";
import NotionPostContent from "../organisms/NotionPostContent";
import useHeaderInView from "../../hooks/useHeaderInView";
import Balancer from "react-wrap-balancer";
import ContentMenu from "../molecules/ContentMenu";
import Tag from "../atoms/Tag";
const PostSinglePage = ({ post, postContent }) => {
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
            <div className="flex space-x-2 mt-2 flex-wrap">
              {post.meta.tags.map((tag, i) => (
                <Tag key={`tag-${i}`} inverted>
                  {tag}
                </Tag>
              ))}
            </div>
            <p className="muted-text mt-1 opacity-100 text-gray-500 ">
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
        <div className="relative">
          <ContentMenu />
          <div className="content-container p-content blog-content">
            <div className="max-w-[56rem] mx-auto">
              <NotionPostContent postContent={postContent} />
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
              }}
            ></ReactionAndComment>
          </div>
        </div>
      </div>
    </>
  );
};
export default PostSinglePage;
