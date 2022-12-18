import { Project } from "../../lib/project";
import Link from "next/link";
import CustomImage from "../atoms/CustomImage";
import { Fragment } from "react";
const ProjectCard = ({ project }: { project: Project }) => {
  const content = (
    <Fragment>
      {project.meta.logo && (
        <div className="w-12 h-12 grow-0 shrink-0">
          <CustomImage
            src={project.meta.logo}
            slug={project.slug}
            width={48}
            height={48}
            alt={project.meta.title}
          />
        </div>
      )}
      <div>
        <h3 className="text-xl">{project.meta.title}</h3>
        <p className="text-sm text-gray-700">{project.meta.tagline}</p>
      </div>
    </Fragment>
  );
  const classname =
    "col-span-6 md:col-span-3 lg:col-span-2 text-gray-900 p-3 transition-all rounded-xl flex flex-row items-center space-x-4 group-hover:opacity-80 hover:!opacity-100 hover:scale-[1.02] active:scale-[1.01] hover:outline-blue-800 hover:outline-2";
  return project.meta.type == "casestudy" ? (
    <Link
      href={`/project/${project.slug}`}
      className={classname}
      style={{ backgroundColor: project.meta.background }}
    >
      {content}
    </Link>
  ) : (
    <a
      target="_blank"
      rel="noreferrer"
      className={classname}
      href={project.meta.link}
      style={{ backgroundColor: project.meta.background }}
    >
      {content}
    </a>
  );
};
const OtherProjectList = ({
  project: currentProject,
  projects,
}: {
  project: Project;
  projects: Project[];
}) => {
  return (
    <div className="mt-6 grid grid-cols-6 gap-4 md:gap-6 group">
      {projects
        .filter((project) => project.slug != currentProject.slug)
        .sort((a, b) => (b.meta.coolness || 0) - (a.meta.coolness || 0))
        .slice(0, 6)
        .map((project, i) => (
          <ProjectCard
            project={project}
            key={`project-card-${project.slug}`}
          ></ProjectCard>
        ))}
    </div>
  );
};
export default OtherProjectList;
