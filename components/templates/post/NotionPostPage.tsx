import { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";
import useHeaderInView from "@hooks/useHeaderInView";
import { Post } from "@lib/blog";
import usePostStore from "@store/usePostStore";
import Fade from "@atoms/Fade";
import HeadMeta from "@atoms/HeadMeta";
import IconButton from "@atoms/IconButton";
import Tag from "@atoms/Tag";
import Tooltip from "@atoms/Tooltip";
import ContentMenu from "@molecules/ContentMenu";
import PasswordProtect from "@molecules/PasswordProtect";
import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import parseBlocks from "@notion/parseBlocks";
import OtherPostList from "./OtherPostList";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import useAppStore from "@store/useAppStore";

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
  const {
    protect: { decryptedPostContent },
    setPost,
    setPostContent,
    setPosts,
  } = usePostStore();
  const isShown = !post.meta.protected || decryptedPostContent != null;

  useEffect(() => {
    setPost(post);
    setPostContent(postContent);
    setPosts(posts);
  }, [setPost, setPostContent, setPosts, post, postContent, posts]);

  const router = useRouter();

  const hasHistory = useAppStore((state) => state.hasHistory);

  return (
    <>
      <HeadMeta
        title={post.meta.title}
        description={post.meta.excerpt}
        tagline={post.meta.tags.map((tag) => "#" + tag).join("  ")}
        emoji={
          post.meta.icon?.type == "emoji" ? post.meta.icon.emoji : undefined
        }
      />
      <header ref={ref} className="z-10 w-full " key={post.slug + "_header"}>
        <div className="flex justify-center p-0 lg:px-container main-container">
          <Fade
            duration={100}
            className="hidden w-8 lg:block p-header grow-0 shrink"
          >
            <Tooltip
              content={hasHistory ? "Back to previous page" : "Back to blog"}
            >
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  if (hasHistory) {
                    router.back();
                  } else {
                    router.push("/blog", undefined, { scroll: false });
                  }
                }}
              >
                <FiArrowLeft />
              </IconButton>
            </Tooltip>
          </Fade>
          <div className="pb-0 grow content-container p-header">
            <div className="grid grid-cols-1 gap-2 md:gap-4 ">
              <div className="flex items-center flex-gap-4">
                <div className="grow">
                  <Balancer>
                    <Fade
                      as="h1"
                      className="col-span-1 text-2xl leading-tight text-gray-800 grow md:text-3xl md:leading-tight lg:text-4xl lg:leading-tight"
                      slide
                      duration={100}
                    >
                      {post.meta.title}
                    </Fade>
                  </Balancer>
                </div>
                {post.meta.icon && post.meta.icon.type == "emoji" ? (
                  <Fade
                    as="span"
                    delay={100}
                    duration={100}
                    className="text-3xl md:text-4xl"
                  >
                    {post.meta.icon.emoji}
                  </Fade>
                ) : null}
              </div>
              <Fade className="flex flex-wrap mt-2 space-x-2" delay={200}>
                {post.meta.tags.map((tag, i) => (
                  <Tag key={`tag-${i}`}>{tag}</Tag>
                ))}
              </Fade>
              <Fade className="mt-1 text-tertiary muted-text" delay={200}>
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
        <div className="pt-8 md:pt-9 content-container p-content blog-content">
          <div className="text-gray-800 [&>*:first-child]:mt-0">
            {post.meta.protected ? (
              <>
                <Transition
                  show={decryptedPostContent != null}
                  enter="transition-all duration-1000"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  {parseBlocks(decryptedPostContent)}
                </Transition>
                <Transition
                  show={decryptedPostContent == null}
                  leave="transition-opacity duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <PasswordProtect />
                </Transition>
              </>
            ) : (
              parseBlocks(postContent)
            )}
          </div>
        </div>
      </Fade>
      <section className="relative bg-surface border-t border-gray-200 p-content">
        <div className="main-container">
          <Transition
            show={isShown}
            enter="transition-all duration-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
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
          </Transition>
          <div
            className={twMerge(
              "relative",
              isShown &&
                "pt-10 mt-10 border-t border-gray-200 md:mt-16 md:pt-12"
            )}
          >
            <OtherPostList post={post} posts={posts}></OtherPostList>
          </div>
        </div>
      </section>
    </>
  );
};
export default PostSinglePage;
