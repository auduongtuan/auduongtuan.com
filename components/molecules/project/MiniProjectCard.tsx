import Link from "next/link";
import CustomImage from "@atoms/CustomImage";
import { Fragment } from "react";
import { Project } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";

const MiniProjectCard = ({ project }: { project: Project }) => {
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
        <h3 className="text-lg leading-tight h3">{project.title}</h3>
        <p className="mt-0.5 text-sm text-secondary line-clamp-2">
          {project.tagline}
        </p>
      </div>
    </Fragment>
  );
  const classname =
    "bg-card col-span-6 md:col-span-3 lg:col-span-2 text-primary p-3 md:p-3.5 transition-all rounded-xl flex flex-row items-center space-x-4 group-hover:opacity-80 hover:opacity-100! hover:scale-[1.02] active:scale-[1.01]";
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

export default MiniProjectCard;
