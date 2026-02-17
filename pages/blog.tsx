import BlogPage from "../components/templates/post/BlogPage";
import { getPosts, Post } from "@lib/notion";
import HeadMeta from "../components/atoms/HeadMeta";

export default function Blog({ posts }: { posts: Post[] }) {
  return (
    <>
      <HeadMeta
        title="Blog"
        description="This is a blog of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center"
      />
      <BlogPage posts={posts} />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: await getPosts(),
    },
    revalidate: 120,
  };
}
