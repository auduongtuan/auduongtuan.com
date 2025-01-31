import { getProjectsWithCache } from "@lib/notion/project";
import HomePage, { HomePageProps } from "@templates/home/HomePage";
import HeadMeta from "@atoms/HeadMeta";
import { getPostsWithCache } from "@lib/notion";

export default function Index({ projects, posts }: HomePageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <HomePage projects={projects} posts={posts} />
    </>
  );
}
export async function getStaticProps() {
  const projects = await getProjectsWithCache();
  const posts = await getPostsWithCache();
  return {
    props: {
      projects,
      posts,
    },
    revalidate: 120,
  };
}
