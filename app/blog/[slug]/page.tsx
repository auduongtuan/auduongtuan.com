import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import DefaultErrorPage from "next/error";
import { getPosts, getPostContent, Post } from "@lib/notion";
import PostPage from "@templates/post/PostPage";
import CryptoJS from "crypto-js";
import { isDevEnvironment } from "@lib/utils";

const PASSWORD = process.env.BLOG_PASSWORD as string;

export async function generateStaticParams() {
  const posts = await getPosts();
  const postSlugs = posts.map((post) => {
    return {
      slug: `/blog/${post.slug}`,
    };
  });
  return postSlugs;
}

export default async function Page({ params }) {
  // Grab the slug from the post URL
  const slug = params.slug;
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
    // Next.js passes the data to my React template for rendering
    return <PostPage post={post} postContent={postContent} posts={posts} />;
  }
}
