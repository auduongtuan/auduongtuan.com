import { Project } from "@lib/project";
import { ProjectSingleHeader } from "./ProjectSingleHeader";
import ProjectSingleFooter from "./ProjectSingleFooter";
import ProjectSingleContent from "./ProjectSingleContent";
import HeadMeta from "@atoms/HeadMeta";
import { NotionProject } from "@lib/notion";
export interface ProjectSinglePageProps {
  project: NotionProject;
  projects: NotionProject[];
  mdxContent?: any;
  notionContent?: any;
}
const ProjectSinglePage = ({
  project,
  projects,
  mdxContent,
  notionContent,
}: ProjectSinglePageProps) => {
  return (
    <div>
      <HeadMeta
        title={project.title}
        description={project.description}
        logo={project.icon ? project.icon.url : null}
        background={project.background}
        tagline={project.tagline}
      />
      <ProjectSingleHeader project={project} />
      <ProjectSingleContent
        project={project}
        mdxContent={mdxContent}
        notionContent={notionContent}
      />
      <ProjectSingleFooter project={project} projects={projects} />
    </div>
  );
};
export default ProjectSinglePage;
