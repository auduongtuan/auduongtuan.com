import Badge from "@atoms/Badge";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import BrowserFrame from "@atoms/Frame";
import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { useBreakpoint } from "@hooks";
import useVisibleRatio from "@hooks/useVisiblePercentage";

import { parseInternalLink } from "@lib/utils";
import { formatProjectDate } from "@lib/utils/format";
import ScrollableTagList from "@molecules/ScrollableTagList";
import Link from "next/link";
import { memo } from "react";
import { FiEye } from "react-icons/fi";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";

type CoverMediaItem = NonNullable<Project["cover"]>[number];

const CoverMediaItem = ({
  media,
  title,
}: {
  media: CoverMediaItem;
  title: string;
}) => {
  return media.type === "image" ? (
    <CustomImage
      src={media.url}
      alt={title + " cover image"}
      width={media.width}
      height={media.height}
    />
  ) : (
    <CustomVideo src={media.url} width={media.width} height={media.height} />
  );
};

const CoverBrowserFrame = ({
  media,
  title,
  coverTitle,
  link,
  className,
}: {
  media: CoverMediaItem;
  title: string;
  coverTitle?: string;
  link?: string;
  className?: string;
}) => (
  <BrowserFrame title={coverTitle} url={link} className={className}>
    <CoverMediaItem media={media} title={title} />
  </BrowserFrame>
);

export type ProjectCardProps = {
  project: Project;
  projects: Project[];
  index: number;
  className?: string;
  horizontal?: boolean;
};

const ProjectCard = memo(
  ({
    project,
    projects,
    index,
    className,
    horizontal = false,
    ...rest
  }: ProjectCardProps) => {
    const { ref, visibleRatio } = useVisibleRatio();
    const vertical = !horizontal;
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
      <div className="flex flex-col grow">
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
              <p className="mt-0.5 md:mt-1 muted-text">{formattedDate}</p>
            )}
          </div>
          {achievements}
        </header>
        <p className="mt-2 md:mt-3 text-secondary body-text">
          <Balancer ratio={0.67}>{project.tagline}</Balancer>
        </p>
        <ScrollableTagList tags={project.roles || []} className="mt-4" />
      </div>
    );

    const footer = (
      <div className="flex gap-4">
        {project.caseStudy && (
          <Button
            scroll={false}
            href={`/project/${project.slug}`}
            arrow
            variant="secondary"
          >
            View project
          </Button>
        )}
        {project.type.includes("web") && !project.caseStudy && (
          <Button
            scroll={false}
            href={project.link ? project.link : "#"}
            showPopoutIcon={true}
            variant="secondary"
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

    let coverContent: React.ReactNode = null;

    if (project.type.includes("web")) {
      const covers = project.cover || [];
      if (covers.length === 1) {
        const coverMedia = covers[0];
        coverContent = (
          <CoverBrowserFrame
            media={coverMedia}
            title={project.title}
            coverTitle={project.coverTitle}
            link={project.link}
            className="max-h-full"
          />
        );
      } else if (covers.length >= 2) {
        // Stack the first two covers: the one below offset 12px up & right
        const [firstCover, secondCover] = covers;
        coverContent = (
          <div className="inline-grid relative pt-7">
            {/* Top card */}
            <div className="z-10 col-start-1 row-start-1">
              <CoverBrowserFrame
                media={firstCover}
                title={project.title}
                coverTitle={project.coverTitle}
                link={project.link}
                className="w-[calc(100%-2rem)] max-h-full"
              />
            </div>

            {/* Card below, offset 12px up and to the right */}
            <div className="col-start-1 row-start-1 opacity-40 -translate-y-7 translate-x-7">
              <CoverBrowserFrame
                media={secondCover}
                title={project.title}
                coverTitle={project.coverTitle}
                link={project.link}
                className="w-[calc(100%-2rem)] max-h-full"
              />
            </div>
          </div>
        );
      }
    } else if (project.cover) {
      coverContent = project.cover.map((coverMedia) => (
        <div
          className={`ease-bounce relative w-full transition-all`}
          key={coverMedia.url}
        >
          <CoverMediaItem media={coverMedia} title={project.title} />
        </div>
      ));
    }

    const coverMedia = (
      <Fade
        className={twMerge(
          "col-span-12",
          !vertical ? "md:col-span-6 md:col-start-7" : "row-start-1",
          "flex items-stretch justify-stretch gap-8 md:gap-4 lg:gap-8",
        )}
        slide
        show={visibleRatio > 0.4}
      >
        {(!project.cover || !project.cover.length) && icon}
        {coverContent}
      </Fade>
    );

    return (
      <div
        ref={ref}
        className={twMerge(
          "p-4 md:p-6 lg:p-6 rounded-2xl text-primary",
          "ease bg-card transition-all duration-400",
          className,
          !vertical && "md:col-span-2",
        )}
        style={{
          opacity: visibleRatio,
        }}
        {...rest}
      >
        <div
          className={twMerge(
            "justify-end items-center gap-x-4 gap-y-8 grid grid-cols-12 h-full",
            vertical ? "grid-rows-[1fr_auto]" : "md:gap-x-16",
          )}
        >
          <Fade
            duration={200}
            show={visibleRatio > 0.4}
            slide
            className={twMerge(
              `col-span-12 transition-all duration-200 ease-bounce intro`,
              !vertical
                ? "row-start-2 md:col-span-6 md:row-start-1"
                : "row-start-2",
            )}
          >
            <div className="flex flex-col gap-6 grow">
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
