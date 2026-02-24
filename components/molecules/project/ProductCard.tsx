import Badge from "@atoms/Badge";
import Button from "@atoms/Button";
import CustomImage from "@atoms/CustomImage";
import Fade from "@atoms/Fade";
import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { useBreakpoint } from "@hooks";
import useVisibleRatio from "@hooks/useVisiblePercentage";
import { Project } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
import { formatProjectDate } from "@lib/utils/format";
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
    const { ref, visibleRatio } = useVisibleRatio();
    const isHalf = true;
    const internalLink = parseInternalLink(project.link || "");
    const formattedDate = formatProjectDate(project.date);
    const _achievement = (
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
    const bp = useBreakpoint();
    const icon = project.icon && (
      <div className="mb-4 h-12 w-12 shrink-0 grow-0">
        <CustomImage
          src={project.icon.url}
          width={48}
          height={48}
          alt={project.title}
        />
      </div>
    );
    const info = (
      <div className="flex grow flex-col">
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
        <p className="body-text text-secondary mt-2 md:mt-3">
          <Balancer ratio={0.67}>{project.tagline}</Balancer>
        </p>
        {/* <ScrollableTagList
          tags={project.roles || []}
          background={"var(--bg-card)"}
          className="mt-4"
        /> */}
      </div>
    );
    const footer = (
      <div className="flex space-x-4">
        {project.caseStudy && (
          <Button
            href={`/project/${project.slug}`}
            arrow
            variant="secondary"
          >
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
        <div className={twMerge("flex h-full gap-4 gap-y-8")}>
          <Fade
            duration={200}
            slide
            className={twMerge(
              `ease-bounce intro flex h-full flex-col transition-all duration-200`,
            )}
          >
            {horizontal || !bp.up("lg") ? (
              <div className="flex gap-4 md:gap-6">
                {icon}
                <div className="flex grow flex-col items-start justify-start gap-6 lg:flex-col">
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
