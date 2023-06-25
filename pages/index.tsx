import allProjects from "../lib/project";
import HomePage, { HomePageProps } from "../components/templates/home/HomePage";
import HeadMeta from "../components/atoms/HeadMeta";

export default function Index({ posts, projects }: HomePageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <HomePage projects={projects} posts={posts} />
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {
      projects: allProjects,
    },
  };
}
