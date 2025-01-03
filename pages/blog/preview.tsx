import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import DefaultErrorPage from "next/error";
import { getPosts, getPostContent, Post } from "@lib/notion";
import PostPage from "@templates/post/PostPage";
import { PasswordInfo } from "@lib/notion/password";

type BlogProps = {
  post: Post;
  postContent: any;
  posts: Post[];
  passwordInfo: PasswordInfo;
};

export default function Blog({
  post,
  postContent,
  posts,
  passwordInfo,
}: BlogProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  if (!post) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} title="No things" />
      </>
    );
  }
  return (
    <PostPage
      post={post}
      postContent={postContent}
      posts={posts}
      passwordInfo={passwordInfo}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Grab the slug from the post URL
  const slug = context.query && context.query.slug;
  const secret = context.query && context.query.secret;
  if (!secret || secret != "eyJhbGciOiJIUzI1NiJ9") {
    return {
      props: {
        post: null,
        postContent: null,
        posts: null,
      },
    };
  }
  // Get all posts from the Notion database
  const posts = await getPosts(true);
  // Find the post with a matching slug property
  let post: Post | null = null;
  const filteredPosts = posts.filter((post) => post.slug === slug);
  if (filteredPosts.length > 0) {
    post = filteredPosts[0];
  }
  // Get the Notion page data and all child block data
  const postContent = post ? await getPostContent(post.id) : null;

  // Next.js passes the data to my React template for rendering
  return {
    props: {
      post,
      postContent,
      posts,
      passwordInfo: {
        hint: "",
        length: 0,
      },
    },
  };
};
