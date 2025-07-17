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
      <h3 className="subheading">Other projects</h3>
      <div className="group mt-6 grid grid-cols-6 gap-4 md:gap-6">
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
