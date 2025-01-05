import { getProjectsWithCache, ProjectGroup } from "@lib/notion/project";
import WorkPage, { WorksPageProps } from "@templates/project/WorkPage";
import HeadMeta from "@atoms/HeadMeta";

export default function Index({ projects, projectGroups }: WorksPageProps) {
  return (
    <>
      <HeadMeta description="This is a personal website of AU DUONG TUAN - A software designer / developer / whatever who strives to make good things with the human at the center" />
      <WorkPage projects={projects} projectGroups={projectGroups} />
    </>
  );
}
export async function getStaticProps() {
  const projects = await getProjectsWithCache();
  const projectGroups = projects.reduce((acc, project) => {
    const found = acc.find(
      (group) => project.group && group.id === project.group.id
    );
    if (!found && project.group) acc.push(project.group);
    return acc;
  }, [] as ProjectGroup[]);
  return {
    props: {
      projects: projects,
      projectGroups: projectGroups,
    },
    revalidate: 120,
  };
}
