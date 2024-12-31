import HeadMeta from "@atoms/HeadMeta";
import { NotionProject } from "@lib/notion";
import useProjectStore from "@store/useProjectStore";
import { useEffect } from "react";
import ProjectSingleContent from "./ProjectSingleContent";
import ProjectSingleFooter from "./ProjectSingleFooter";
import { ProjectSingleHeader } from "./ProjectSingleHeader";
import { PasswordInfo } from "@lib/notion/password";
export interface ProjectSinglePageProps {
  project: NotionProject;
  projects: NotionProject[];
  mdxContent?: any;
  notionContent?: any;
  passwordInfo: PasswordInfo;
}

const ProjectSinglePage = ({
  project,
  projects,
  mdxContent,
  notionContent,
  passwordInfo,
}: ProjectSinglePageProps) => {
  const { setProject, setProjects } = useProjectStore();
  useEffect(() => {
    setProject(project);
    setProjects(projects);
  }, [setProject, setProjects, project, projects]);

  return (
    <div>
      <HeadMeta
        title={project.title}
        description={project.description}
        logo={project.icon ? project.icon.url : undefined}
        background={project.background}
        tagline={project.tagline}
      />
      <ProjectSingleHeader project={project} />
      <ProjectSingleContent
        project={project}
        notionContent={notionContent}
        passwordInfo={passwordInfo}
      />
      <ProjectSingleFooter project={project} projects={projects} />
    </div>
  );
};
export default ProjectSinglePage;
