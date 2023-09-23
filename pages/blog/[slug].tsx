import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import DefaultErrorPage from "next/error";
import { getPosts, getPostContent, Post } from "../../lib/blog";
import NotionPostPage from "../../components/templates/post/NotionPostPage";
import CryptoJS from "crypto-js";
import PASSWORD, { isDevEnvironment } from "../../lib/password";

type BlogProps = {
  post: Post;
  postContent: any;
  posts: Post[];
};

export default function Blog({ post, postContent, posts }: BlogProps) {
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
  return <NotionPostPage post={post} postContent={postContent} posts={posts} />;
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
  const posts = await getPosts(isDevEnvironment);
  // Find the post with a matching slug property
  let post: Post | null = null;
  const filteredPosts = posts.filter((post) => post.slug === slug);
  if (filteredPosts.length > 0) {
    post = filteredPosts[0];
  }
  // Get the Notion page data and all child block data
  let postContent: any = null;
  if (post) {
    const rawPostContent = await getPostContent(post.id);
    if (post.meta.protected) {
      const json = JSON.stringify(rawPostContent);
      const encrypted = CryptoJS.AES.encrypt(json, PASSWORD).toString();
      postContent = encrypted;
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
    },
    revalidate: 120,
  };
}
