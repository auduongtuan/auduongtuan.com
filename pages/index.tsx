import allProjects from "../lib/project";
import { getNotionProjects } from "@lib/notion/project";
import HomePage, { HomePageProps } from "../components/templates/home/HomePage";
import HeadMeta from "../components/atoms/HeadMeta";
import { isDevEnvironment } from "../lib/password";

export default function Index({
  posts,
  projects,
  notionProjects,
}: HomePageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <HomePage
        projects={projects}
        posts={posts}
        notionProjects={notionProjects}
      />
    </>
  );
}
export async function getStaticProps() {
  const notionProjects = await getNotionProjects(isDevEnvironment);
  return {
    props: {
      projects: allProjects,
      notionProjects: notionProjects,
    },
  };
}
