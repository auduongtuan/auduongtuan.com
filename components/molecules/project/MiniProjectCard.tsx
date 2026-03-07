import Link from "next/link";
import ProjectIcon from "@atoms/ProjectIcon";
import { Fragment, useEffect, useState } from "react";
import { Project } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
import { resolveThemedSurfaceColor } from "@lib/utils/themeColor";
import { useTheme } from "next-themes";

const MiniProjectCard = ({ project }: { project: Project }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const internalLink = parseInternalLink(project.link || "") || "";
  const themedBackgroundColor = resolveThemedSurfaceColor(
    project.background || "var(--bg-card)",
    mounted ? resolvedTheme : "light",
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <Fragment>
      {project.icon && (
        <ProjectIcon src={project.icon.url} size={48} alt={project.title} />
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
      style={{ backgroundColor: themedBackgroundColor }}
    >
      {content}
    </Link>
  ) : (
    <a
      target="_blank"
      rel="noreferrer"
      className={classname}
      href={project.link}
      style={{ backgroundColor: themedBackgroundColor }}
    >
      {content}
    </a>
  );
};

export default MiniProjectCard;
