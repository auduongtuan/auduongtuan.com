import Badge from "@atoms/Badge";
import Button from "@atoms/Button";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import BrowserFrame from "@atoms/Frame";
import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { useBreakpoint } from "@hooks";
import useVisibleRatio from "@hooks/useVisiblePercentage";
import { Project } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
import { formatProjectDate } from "@lib/utils/format";
import ScrollableTagList from "@molecules/ScrollableTagList";
import Link from "next/link";
import { memo } from "react";
import { FiEye } from "react-icons/fi";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";

export type ProjectCardProps = {
  project: Project;
  projects: Project[];
  index: number;
  className?: string;
};

const ProjectCard = memo(
  ({ project, projects, index, className, ...rest }: ProjectCardProps) => {
    const { ref, visibleRatio } = useVisibleRatio();
    const isHalf = true;
    const internalLink = parseInternalLink(project.link || "");
    const formattedDate = formatProjectDate(project.date);
    const bp = useBreakpoint();

    const achievements = (
      <Fade className={twMerge("shrink-0 grow-0")} duration={300} delay={400}>
        {project.achievements && (
          <div className="flex gap-4">
            {project.achievements.map((achievement, i) => (
              <Badge size="small" key={i} index={i} content={achievement} />
            ))}
          </div>
        )}
      </Fade>
    );

    const icon = project.icon && (
      <CustomImage
        src={project.icon.url}
        width={72}
        height={72}
        alt={project.title}
      />
    );

    const info = (
      <div className="flex grow flex-col">
        <header className="flex items-center">
          <div className="grow">
            <h2 className="h3">
              {project.caseStudy ? (
                <Link href={`/project/${project.slug}`}>
                  <Balancer>{project.title}</Balancer>
                </Link>
              ) : (
                <Balancer>{project.title}</Balancer>
              )}
            </h2>
            {formattedDate && (
              <p className="muted-text mt-0.5 md:mt-1">{formattedDate}</p>
            )}
          </div>
          {achievements}
        </header>
        <p className="body-text text-secondary mt-2 md:mt-3">
          <Balancer ratio={0.67}>{project.tagline}</Balancer>
        </p>
        <ScrollableTagList
          tags={project.roles || []}
          background={"var(--bg-card)"}
          className="mt-4"
        />
      </div>
    );

    const footer = (
      <div className="flex gap-4">
        {project.caseStudy && (
          <Button scroll={false} href={`/project/${project.slug}`} arrow>
            View project
          </Button>
        )}
        {project.type.includes("web") && !project.caseStudy && (
          <Button
            scroll={false}
            href={project.link ? project.link : "#"}
            showPopoutIcon={true}
          >
            View website
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

    const coverMedia = (
      <Fade
        className={twMerge(
          "col-span-12",
          !isHalf ? "md:col-span-7 md:col-start-6" : "row-start-1",
          "flex items-stretch justify-stretch gap-8 md:gap-4 lg:gap-8",
        )}
        slide
        show={visibleRatio > 0.4}
      >
        {(!project.cover || !project.cover.length) && icon}
        {project.cover &&
          project.cover.map((coverMedia) =>
            project.type.includes("web") ? (
              <BrowserFrame
                title={project.coverTitle}
                url={project.link}
                className="max-h-full"
                key={coverMedia.url}
              >
                {coverMedia.type === "image" ? (
                  <CustomImage
                    src={coverMedia.url}
                    alt={project.title + " cover image"}
                    width={coverMedia.width}
                    height={coverMedia.height}
                  />
                ) : (
                  <CustomVideo
                    src={coverMedia.url}
                    width={coverMedia.width}
                    height={coverMedia.height}
                  ></CustomVideo>
                )}
              </BrowserFrame>
            ) : (
              <div
                className={`ease-bounce relative w-full transition-all`}
                key={coverMedia.url}
              >
                <CustomImage
                  src={coverMedia.url}
                  alt={project.title + " cover image"}
                  width={coverMedia.width}
                  height={coverMedia.height}
                />
              </div>
            ),
          )}
      </Fade>
    );

    return (
      <div
        ref={ref}
        className={twMerge(
          "text-primary rounded-2xl p-4 md:p-6 lg:p-6",
          "ease bg-card transition-all duration-400",
          className,
        )}
        style={{
          opacity: visibleRatio,
        }}
        {...rest}
      >
        <div
          className={twMerge(
            "grid h-full grid-cols-12 items-center justify-end gap-4 gap-y-8",
            isHalf && "grid-rows-[1fr_auto]",
          )}
        >
          <Fade
            duration={200}
            show={visibleRatio > 0.4}
            slide
            className={twMerge(
              `ease-bounce intro col-span-12 transition-all duration-200`,
              !isHalf
                ? "row-start-2 md:col-span-4 md:row-start-1"
                : "row-start-2",
            )}
          >
            <div className="flex grow flex-col gap-6">
              {info}
              {footer}
            </div>
          </Fade>
          {coverMedia}
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "NotionProjectItem";
export default ProjectCard;
