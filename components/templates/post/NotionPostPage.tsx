import { Post } from "../../../lib/blog";
import Balancer from "react-wrap-balancer";
import HeadMeta from "../../atoms/HeadMeta";
import ReactionAndComment from "../../molecules/comment/ReactionAndComment";
import useHeaderInView from "../../../hooks/useHeaderInView";
import ContentMenu from "../../molecules/ContentMenu";
import Tag from "../../atoms/Tag";
import parseBlocks from "../../notion/parseBlocks";
import Fade from "../../atoms/Fade";
import OtherPostList from "./OtherPostList";
const PostSinglePage = ({ post, postContent, posts }: {post: Post, posts: Post[], postContent: any}) => {
  const { ref } = useHeaderInView();
  return (
    <>
      <HeadMeta title={post.meta.title} />
      <header
        ref={ref}
        className="bg-custom-neutral-900 text-white w-full z-10"
      >
        <div className="content-container p-header">
          <div className="grid grid-cols-1 gap-2 md:gap-4 max-w-[50rem] mx-auto">
            <Balancer>
              <Fade as="h1" className="text-2xl md:text-3xl leading-tight md:leading-tight lg:text-5xl lg:leading-tight col-span-1" slide duration={100}>
                {post.meta.title}
              </Fade>
            </Balancer>
            <Fade className="flex space-x-2 mt-2 flex-wrap" delay={200}>
              {post.meta.tags.map((tag, i) => (
                <Tag key={`tag-${i}`} inverted>
                  {tag}
                </Tag>
              ))}
            </Fade>
            <Fade className="muted-text mt-1 text-gray-500" delay={200}>
              Posted on{" "}
              {post.meta.date &&
                new Date(post.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </Fade>
          </div>
        </div>
      </header>
        <Fade className="relative" delay={200}>
          <ContentMenu />
          <div className="content-container p-content blog-content">
            <div className="max-w-[50rem] mx-auto">
              <div className="text-gray-800 [&>*:first-child]:mt-0">{parseBlocks(postContent)}</div>
            </div>
          </div>
        </Fade>
        <section className="bg-white border-gray-200 border-t p-content relative">
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
            <div className="relative border-gray-200 border-t mt-10 md:mt-16 pt-10 md:pt-12">
              <OtherPostList post={post} posts={posts}></OtherPostList>
            </div>
          </div>
      </section>
    </>
  );
};
export default PostSinglePage;
