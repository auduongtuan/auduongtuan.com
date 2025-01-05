import { getProjectsWithCache } from "@lib/notion/project";
import WorkPage, { WorksPageProps } from "@templates/project/WorkPage";
import HeadMeta from "@atoms/HeadMeta";

export default function Index({ projects }: WorksPageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <WorkPage projects={projects} />
    </>
  );
}
export async function getStaticProps() {
  const projects = await getProjectsWithCache();
  return {
    props: {
      projects: projects,
    },
    revalidate: 120,
  };
}
