import Fade from "@atoms/Fade";
import HeadMeta from "@atoms/HeadMeta";
import Tag from "@atoms/Tag";
import { Transition } from "@headlessui/react";
import { Post } from "@lib/notion";
import { PasswordInfo } from "@lib/notion/password";
import ContentMenu from "@molecules/ContentMenu";
import HeaderWithBackButton from "@molecules/HeaderWithBackButton";
import PasswordProtect from "@molecules/PasswordProtect";
import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import parseBlocks from "@notion/parseBlocks";
import usePasswordProtectStore from "@store/usePasswordProtectStore";
import usePostStore from "@store/usePostStore";
import { useEffect } from "react";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";
import OtherPostList from "./OtherPostList";

const PostSinglePage = ({
  post,
  postContent,
  posts,
  passwordInfo,
}: {
  post: Post;
  posts: Post[];
  postContent: any;
  passwordInfo: PasswordInfo;
}) => {
  const { decryptedContent } = usePasswordProtectStore();
  const { setPost, setPostContent, setPosts } = usePostStore();
  const isShown = !post.meta.protected || decryptedContent != null;

  useEffect(() => {
    setPost(post);
    setPostContent(postContent);
    setPosts(posts);
  }, [setPost, setPostContent, setPosts, post, postContent, posts]);

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
      <div className="z-10 w-full" key={post.slug + "_header"}>
        <HeaderWithBackButton
          backLink="/blog"
          backLinkLabel="Back to blog"
          smallBottomPadding
        >
          <div className="grid grid-cols-1 gap-2 md:gap-4">
            <div className="flex items-center gap-4">
              <div className="shrink grow basis-0">
                <Fade
                  as="h1"
                  className="text-primary h1 col-span-1 grow"
                  slide
                  duration={100}
                >
                  <Balancer>{post.meta.title}</Balancer>
                </Fade>
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
            {post.meta.tags.length > 0 && (
              <Fade className="mt-2 flex flex-wrap space-x-2" delay={200}>
                {post.meta.tags.map((tag, i) => (
                  <Tag key={`tag-${i}`}>{tag}</Tag>
                ))}
              </Fade>
            )}
            <Fade
              className="text-tertiary muted-text mt-1 font-mono"
              delay={200}
            >
              Posted on{" "}
              {post.meta.date &&
                new Date(post.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </Fade>
          </div>
        </HeaderWithBackButton>
      </div>
      <Fade
        className="pb-section-vertical relative"
        delay={200}
        key={post.slug + "_content"}
      >
        <ContentMenu />
        <div className="main-container px-0">
          {post.meta.protected ? (
            <>
              <Transition
                show={decryptedContent != null}
                enter="transition-all duration-1000"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                as="div"
                className={
                  "text-primary content-blocks-grid [&>*:first-child]:mt-0"
                }
              >
                {parseBlocks(decryptedContent, post.assets)}
              </Transition>
              <Transition
                show={decryptedContent == null}
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                as="div"
                className={
                  "text-primary content-container [&>*:first-child]:mt-0"
                }
              >
                <PasswordProtect
                  encryptedContent={postContent}
                  mode="post"
                  passwordInfo={passwordInfo}
                />
              </Transition>
            </>
          ) : (
            <div className="content-blocks-grid">
              {parseBlocks(postContent, post.assets)}
            </div>
          )}
        </div>
      </Fade>
      <section className="bg-surface py-section-vertical relative border-t border-gray-200">
        <div className="main-container">
          <Transition
            show={isShown}
            enter="transition-all duration-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            as="div"
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
                "mt-10 border-t border-gray-200 pt-10 md:mt-16 md:pt-12",
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
