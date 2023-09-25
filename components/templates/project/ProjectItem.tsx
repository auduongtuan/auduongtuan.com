import { memo } from "react";
import { Project } from "@lib/project";
import Button from "@atoms/Button";
import { FiEye } from "react-icons/fi";
import IconButton from "@atoms/IconButton";
import Link from "next/link";
import BrowserFrame from "@atoms/Frame";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Balancer from "react-wrap-balancer";
import Fade from "@atoms/Fade";
import useVisibleRatio from "@hooks/useVisiblePercentage";
import Tooltip from "@atoms/Tooltip";
import { twMerge } from "tailwind-merge";
import ScrollableTagList from "@molecules/ScrollableTagList";

export type ProjectItemProps = {
  project: Project;
  projects: Project[];
  index: number;
};

const ProjectItem = memo(
  ({ project, projects, index, ...rest }: ProjectItemProps) => {
    const { ref, visibleRatio } = useVisibleRatio();
    const isHalf = projects.length % 2 == 0 || index !== 0;
    return (
      <div
        ref={ref}
        className={twMerge(
          "rounded-2xl p-6 md:p-10 lg:p-12 text-primary",
          !isHalf ? "col-span-12" : "col-span-12 md:col-span-6",
          "transition-all ease duration-400"
        )}
        style={{
          backgroundColor: project.meta.background,
          opacity: visibleRatio,
        }}
        {...rest}
      >
        <div
          className={twMerge(
            "grid items-center justify-end h-full grid-cols-12 gap-4 gap-y-8",
            isHalf && "grid-rows-[1fr_auto]"
          )}
        >
          <Fade
            duration={200}
            show={visibleRatio > 0.4}
            slide
            className={twMerge(
              `col-span-12 transition-all duration-200 ease-bounce intro`,
              !isHalf
                ? "row-start-2 md:row-start-1 md:col-span-4"
                : "row-start-2"
            )}
          >
            <h2>
              <Balancer>
                {project.meta.type == "casestudy" ? (
                  <Link href={`/project/${project.slug}`} legacyBehavior>
                    {project.meta.title}
                  </Link>
                ) : (
                  project.meta.title
                )}
              </Balancer>
            </h2>
            <p className="md:mt-1 muted-text">
              {new Date(project.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
            <p className="mt-2 text-base md:mt-4 md:text-lg tracking-relaxed md:tracking-relaxed _md:text-xl _tracking-tight _font-display">
              <Balancer ratio={0.67}>{project.meta.tagline}</Balancer>
            </p>
            <ScrollableTagList
              tags={project.meta.roles || []}
              background={project.meta.background || "#EEEEEE"}
              className="mt-4"
            />

            <div className="flex mt-6 space-x-4 md:mt-8">
              {project.meta.type == "casestudy" && (
                <Button scroll={false} href={`/project/${project.slug}`} arrow>
                  Case study
                </Button>
              )}
              {project.meta.type == "post" && (
                <Button
                  scroll={false}
                  href={`/blog/${project.meta.postSlug}`}
                  arrow
                >
                  Read post
                </Button>
              )}
              {project.meta.type == "link" && (
                <Button
                  scroll={false}
                  href={project.meta.link ? project.meta.link : "#"}
                  external={true}
                >
                  View website
                </Button>
              )}
              {project.meta.type != "link" && project.meta.link && (
                <Tooltip content={project.meta.linkCta || "View website"}>
                  <IconButton
                    href={project.meta.link ? project.meta.link : "#"}
                    external
                  >
                    <FiEye />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </Fade>
          <Fade
            className={twMerge(
              "col-span-12",
              !isHalf ? "md:col-start-6 md:col-span-7" : "row-start-1",
              "flex justify-stretch items-stretch flex-gap-8 md:flex-gap-4 lg:flex-gap-8"
            )}
            slide
            show={visibleRatio > 0.4}
          >
            {project.meta.video && (
              <BrowserFrame
                url={project.meta.link && project.meta.link}
                className="max-h-full"
              >
                <CustomVideo
                  src={project.meta.video}
                  slug={project.slug}
                  width={project.meta.videoWidth}
                  height={project.meta.videoHeight}
                ></CustomVideo>
              </BrowserFrame>
            )}
            {project.meta.cover && project.meta.browser && (
              <BrowserFrame url={project.meta.link && project.meta.link}>
                <CustomImage
                  slug={project.slug}
                  src={project.meta.cover}
                  alt={project.meta.title}
                  width={project.meta.coverWidth}
                  height={project.meta.coverHeight}
                />
              </BrowserFrame>
            )}

            {project.meta.cover && !project.meta.browser && (
              <div className={`relative transition-all ease-bounce w-full `}>
                <CustomImage
                  slug={project.slug}
                  src={project.meta.cover}
                  alt={project.meta.title}
                  width={project.meta.coverWidth}
                  height={project.meta.coverHeight}
                />
              </div>
            )}
            {project.meta.cover2 && !project.meta.browser && (
              <div className={`relative transition-all ease-bounce w-full `}>
                <CustomImage
                  slug={project.slug}
                  src={project.meta.cover2}
                  alt={project.meta.title}
                  width={project.meta.coverWidth}
                  height={project.meta.coverHeight}
                />
              </div>
            )}
          </Fade>
        </div>
      </div>
    );
  }
);

ProjectItem.displayName = "ProjectItem";
export default ProjectItem;
