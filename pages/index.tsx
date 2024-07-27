import {
  getNotionProjectsWithCache,
  getNotionProjects,
} from "@lib/notion/project";
import HomePage, { HomePageProps } from "../components/templates/home/HomePage";
import HeadMeta from "../components/atoms/HeadMeta";

export default function Index({ notionProjects }: HomePageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <HomePage notionProjects={notionProjects} />
    </>
  );
}
export async function getStaticProps() {
  const notionProjects = await getNotionProjects(true);
  return {
    props: {
      notionProjects: notionProjects,
    },
    revalidate: 120,
  };
}
