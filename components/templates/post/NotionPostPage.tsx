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
import IconButton from "../../atoms/IconButton";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
const PostSinglePage = ({
  post,
  postContent,
  posts,
}: {
  post: Post;
  posts: Post[];
  postContent: any;
}) => {
  const { ref } = useHeaderInView(true);
  return (
    <>
      <HeadMeta title={post.meta.title} />
      <header ref={ref} className="z-10 w-full " key={post.slug + "_header"}>
        <div className="flex justify-center p-0 lg:px-container main-container">
          <Fade
            duration={100}
            className="hidden w-8 lg:block p-header grow-0 shrink"
          >
            <Link href="/blog" legacyBehavior>
              <IconButton href="/blog" content="Back to Blog">
                <FiArrowLeft />
              </IconButton>
            </Link>
          </Fade>
          <div className="pb-0 grow content-container p-header">
            <div className="grid grid-cols-1 gap-2 md:gap-4 ">
              <Balancer>
                <Fade
                  as="h1"
                  className="col-span-1 text-2xl leading-tight text-gray-800 md:text-3xl md:leading-tight lg:text-4xl lg:leading-tight"
                  slide
                  duration={100}
                >
                  {post.meta.title}
                </Fade>
              </Balancer>
              <Fade className="flex flex-wrap mt-2 space-x-2" delay={200}>
                {post.meta.tags.map((tag, i) => (
                  <Tag key={`tag-${i}`}>{tag}</Tag>
                ))}
              </Fade>
              <Fade className="mt-1 text-gray-500 muted-text" delay={200}>
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
          <div className="hidden w-8 lg:block p-header grow-0 shrink"></div>
        </div>
      </header>
      <Fade className="relative" delay={200} key={post.slug + "_content"}>
        <ContentMenu />
        <div className="pt-8 md:pt-12 content-container p-content blog-content">
          <div className="text-gray-800 [&>*:first-child]:mt-0">
            {parseBlocks(postContent)}
          </div>
        </div>
      </Fade>
      <section className="relative bg-white border-t border-gray-200 p-content">
        <div className="main-container">
          <ReactionAndComment
            page={`blog/${post.slug}`}
            wording={{
              singular: "thought",
              plural: "thoughts",
              title: "Share your thoughts",
              cta: "Or wanna share your thoughts?",
              placeholder: "Hmmm... I think...",
            }}
          ></ReactionAndComment>
          <div className="relative pt-10 mt-10 border-t border-gray-200 md:mt-16 md:pt-12">
            <OtherPostList post={post} posts={posts}></OtherPostList>
          </div>
        </div>
      </section>
    </>
  );
};
export default PostSinglePage;
