import { Project } from "../../../lib/project";
import { ProjectSingleHeader } from "./ProjectSingleHeader";
import ProjectSingleFooter from "./ProjectSingleFooter";
import ProjectSingleContent from "./ProjectSingleContent";
import HeadMeta from "../../atoms/HeadMeta";
export interface ProjectSinglePageProps {
  project: Project;
  projects: Project[];
}
const ProjectSinglePage = ({ project, projects }: ProjectSinglePageProps) => {
  return (
    <div>
      <HeadMeta title={project.meta.title} description={project.meta.description} />
      <ProjectSingleHeader project={project} />
      <ProjectSingleContent project={project} />
      <ProjectSingleFooter project={project} projects={projects} />
    </div>
  );
};
export default ProjectSinglePage;