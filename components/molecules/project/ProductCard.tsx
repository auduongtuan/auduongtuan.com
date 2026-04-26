import Badge from "@atoms/Badge";
import Button from "@atoms/Button";
import ProjectIcon from "@atoms/ProjectIcon";
import Fade from "@atoms/Fade";
import IconButton from "@atoms/IconButton";
import SoundLink from "@atoms/SoundLink";
import Tooltip from "@atoms/Tooltip";
import { useBreakpoint } from "@hooks";
import { Project } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
import { formatProjectDate } from "@lib/utils/format";
import { memo } from "react";
import { FiEye } from "react-icons/fi";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";

export type ProjectCardProps = {
  project: Project;
  projects: Project[];
  index: number;
  className?: string;
  horizontal?: boolean;
};

const ProductCard = memo(
  ({
    project,
    projects,
    index,
    className,
    horizontal = false,
    ...rest
  }: ProjectCardProps) => {
    const internalLink = parseInternalLink(project.link || "");
    const formattedDate = formatProjectDate(project.date);
    const bp = useBreakpoint();
    const achievementBadgeSize = bp.breakpoint === "sm" ? "tiny" : "small";
    const achievements = (
      <Fade className={twMerge("shrink-0 grow-0")} duration={300} delay={400}>
        {project.achievements && (
          <div className="flex gap-4">
            {project.achievements.map((achievement, i) => (
              <Badge
                size={achievementBadgeSize}
                key={i}
                index={i}
                content={achievement}
              />
            ))}
          </div>
        )}
      </Fade>
    );
    const icon = project.icon && (
      <ProjectIcon
        src={project.icon.url}
        size={52}
        mobileSize={44}
        alt={project.title}
        className="mb-4"
      />
    );
    const info = (
      <div className="">
        {project.achievements?.length ? (
          <div className="float-right inline-block pb-1 pl-1">
            {achievements}
          </div>
        ) : null}
        <h2 className="inline-block text-base font-semibold md:text-lg">
          {project.caseStudy ? (
            <SoundLink href={`/project/${project.slug}`}>
              {project.title}
            </SoundLink>
          ) : (
            project.title
          )}
        </h2>
        {formattedDate && <p className="muted-text">{formattedDate}</p>}
        <p className="text-secondary small-body-text mt-2 text-balance md:mt-3">
          {project.tagline}
        </p>

        {/* <ScrollableTagList
          tags={project.roles || []}
          background={"var(--bg-card)"}
          className="mt-4"
        /> */}
      </div>
    );
    const footer = (
      <div className="flex gap-x-3 md:gap-x-4">
        {project.caseStudy && (
          <Button href={`/project/${project.slug}`} arrow variant="secondary">
            View product
          </Button>
        )}
        {project.type.includes("web") && !project.caseStudy && (
          <Button
            href={project.link ? project.link : "#"}
            showPopoutIcon={true}
            variant="secondary"
          >
            View website
          </Button>
        )}
        {!project.caseStudy && project.link && (
          <Button
            href={project.link ? project.link : "#"}
            showPopoutIcon={!internalLink}
            arrow={!!internalLink}
            variant="secondary"
          >
            View product
          </Button>
        )}
        {project.caseStudy && project.link && !internalLink && (
          <Tooltip
            content={
              project.linkCta || project.tags.includes("my product")
                ? "Get product"
                : "View website"
            }
          >
            <IconButton href={project.link ? project.link : "#"} external>
              <FiEye />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
    return (
      <div
        className={twMerge(
          "text-primary rounded-2xl p-4 md:p-6",
          "ease bg-card transition-all duration-400",
          className,
        )}
        {...rest}
      >
        <div className={twMerge("flex h-full w-full gap-4 md:gap-y-8")}>
          <Fade
            duration={200}
            slide
            className={twMerge(
              `ease-bounce intro flex h-full w-full flex-col transition-all duration-200`,
            )}
          >
            {horizontal || !bp.up("lg") ? (
              <div className="flex gap-4 md:gap-6">
                {icon}
                <div className="flex grow flex-col items-start justify-start gap-3 md:gap-4 lg:flex-col">
                  {info}
                  {footer}
                </div>
              </div>
            ) : (
              <div className="flex grow flex-col gap-6">
                <div className="flex grow flex-col items-start justify-start lg:flex-col">
                  {icon}
                  {info}
                </div>

                {footer}
              </div>
            )}
          </Fade>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "NotionProjectItem";
export default ProductCard;
