import { Project } from "@lib/project";
import Link from "next/link";
import CustomImage from "@atoms/CustomImage";
import { Fragment } from "react";
import { NotionProject } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
const ProjectCard = ({ project }: { project: NotionProject }) => {
  const internalLink = parseInternalLink(project.link || "") || "";
  const content = (
    <Fragment>
      {project.icon && (
        <div className="w-12 h-12 grow-0 shrink-0">
          <CustomImage
            src={project.icon.url}
            width={48}
            height={48}
            alt={project.title}
          />
        </div>
      )}
      <div>
        <h3 className="text-lg leading-tight">{project.title}</h3>
        <p className="mt-0.5 text-sm text-secondary">{project.tagline}</p>
      </div>
    </Fragment>
  );
  const classname =
    "col-span-6 md:col-span-3 lg:col-span-2 text-primary p-3 md:p-3.5 transition-all rounded-xl flex flex-row items-center space-x-4 group-hover:opacity-80 hover:!opacity-100 hover:scale-[1.02] active:scale-[1.01] hover:outline-blue-800 hover:outline-2";
  return project.caseStudy || internalLink ? (
    <Link
      href={project.caseStudy ? `/project/${project.slug}` : internalLink}
      className={classname}
      style={{ backgroundColor: project.background }}
    >
      {content}
    </Link>
  ) : (
    <a
      target="_blank"
      rel="noreferrer"
      className={classname}
      href={project.link}
      style={{ backgroundColor: project.background }}
    >
      {content}
    </a>
  );
};
const OtherProjectList = ({
  project: currentProject,
  projects,
}: {
  project: NotionProject;
  projects: NotionProject[];
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
            <ProjectCard
              project={project}
              key={`project-card-${project.slug}`}
            ></ProjectCard>
          ))}
      </div>
    </>
  );
};
export default OtherProjectList;
