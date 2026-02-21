import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import DefaultErrorPage from "next/error";
import { getPosts, getPostContent, Post } from "@lib/notion";
import PostPage from "@templates/post/PostPage";
import CryptoJS from "crypto-js";
import { getPassword } from "@lib/notion/password";

type BlogProps = {
  post: Post;
  postContent: any;
  posts: Post[];
  passwordInfo: {
    hint: string;
    length: number;
  };
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
        <DefaultErrorPage statusCode={404} />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  const postSlugs = posts.map((post) => {
    return {
      params: {
        slug: `/blog/${post.slug}`,
      },
    };
  });
  return {
    paths: postSlugs,
    fallback: "blocking",
  };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  // Grab the slug from the post URL
  const slug = context.params && context.params.slug;
  // Get all posts from the Notion database
  const posts = await getPosts();
  // Find the post with a matching slug property
  let post: Post | null = null;
  const filteredPosts = posts.filter((post) => post.slug === slug);
  if (filteredPosts.length > 0) {
    post = filteredPosts[0];
  }
  // Get the Notion page data and all child block data
  let postContent: any = null;
  let passwordInfo = { hint: "", length: 0 };
  if (post) {
    const rawPostContent = await getPostContent(post.id);
    if (post.meta.protected && post.meta.passwordId) {
      const passsword = post.meta.passwordId
        ? await getPassword(post.meta.passwordId)
        : undefined;
      const json = JSON.stringify(rawPostContent);
      if (passsword) {
        const encrypted = CryptoJS.AES.encrypt(
          json,
          passsword.value
        ).toString();
        postContent = encrypted;
        passwordInfo.hint = passsword.hint;
        passwordInfo.length = passsword.value.length;
      }
    } else {
      postContent = rawPostContent;
    }
  }

  // Next.js passes the data to my React template for rendering
  return {
    props: {
      post,
      postContent,
      posts,
      passwordInfo,
    },
    revalidate: 120,
  };
}
