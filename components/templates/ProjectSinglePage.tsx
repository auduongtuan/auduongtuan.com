import { Project } from "../../lib/project";
import { ProjectSingleHeader } from "../organisms/ProjectSingleHeader";
import Navigation from "../organisms/Navigation";
import ProjectSingleFooter from "../organisms/ProjectSingleFooter";
import ProjectSingleContent from "../organisms/ProjectSingleContent";
import HeadMeta from "../atoms/HeadMeta";
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
      <ProjectSingleFooter projects={projects} />
    </div>
  );
};
export default ProjectSinglePage;
