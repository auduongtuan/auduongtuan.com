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
        <p className="text-secondary body-text mt-2 md:mt-3">
          <Balancer ratio={0.67}>{project.tagline}</Balancer>
        </p>
        <ScrollableTagList tags={project.roles || []} className="mt-4" />
      </div>
    );

    const footer = (
      <div className="flex gap-4">
        {project.caseStudy && (
          <Button
            href={`/project/${project.slug}`}
            arrow
            variant="secondary"
          >
            View project
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
          <div className="group relative inline-grid pt-7">
            {/* Top card */}
            <div className="z-10 col-start-1 row-start-1">
              <div className="relative max-h-full w-[calc(100%-1rem)]">
                <CoverBrowserFrame
                  media={firstCover}
                  title={project.title}
                  coverTitle={project.coverTitle}
                  link={project.link}
                  className="max-h-full max-w-full group-hover:opacity-0"
                />
                <div className="border-divider absolute top-0 left-0 h-full w-full rounded-xl border border-dashed opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>

            {/* Card below, offset 12px up and to the right */}
            <div className="col-start-1 row-start-1 translate-x-4 -translate-y-4 group-hover:z-20">
              <div className="relative max-h-full w-[calc(100%-1rem)]">
                <CoverBrowserFrame
                  media={secondCover}
                  title={project.title}
                  coverTitle={project.coverTitle}
                  link={project.link}
                  className="max-h-full max-w-full opacity-0 group-hover:opacity-100"
                />
                <div className="border-divider absolute top-0 left-0 h-full w-full rounded-xl border border-dashed group-hover:opacity-0"></div>
              </div>
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
          "col-span-2",
          !vertical ? "md:col-span-1 md:col-start-2" : "row-start-1",
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
          "text-primary rounded-2xl p-4 md:p-6 lg:p-6",
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
            "grid h-full grid-cols-2 items-center justify-end gap-x-4 gap-y-8",
            vertical ? "grid-rows-[1fr_auto]" : "md:gap-x-16",
          )}
        >
          <Fade
            duration={200}
            show={visibleRatio > 0.4}
            slide
            className={twMerge(
              `ease-bounce intro col-span-2 transition-all duration-200`,
              !vertical
                ? "row-start-2 md:col-span-1 md:row-start-1"
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
