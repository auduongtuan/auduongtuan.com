import { Project } from "@lib/notion";
import MiniProjectCard from "@molecules/project/MiniProjectCard";

const OtherProjectList = ({
  project: currentProject,
  projects,
}: {
  project: Project;
  projects: Project[];
}) => {
  return (
    <>
      <h3 className="sub-heading">Other projects</h3>
      <div className="grid grid-cols-6 gap-4 mt-6 md:gap-6 group">
        {projects
          .filter((project) => project.slug != currentProject.slug)
          .sort((a, b) => (b.point || 0) - (a.point || 0))
          .slice(0, 6)
          .map((project, i) => (
            <MiniProjectCard
              project={project}
              key={`project-card-${project.slug}`}
            ></MiniProjectCard>
          ))}
      </div>
    </>
  );
};

export default OtherProjectList;
