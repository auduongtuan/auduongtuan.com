import Badge from "@atoms/Badge";
import Button from "@atoms/Button";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import BrowserFrame from "@atoms/Frame";
import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import useVisibleRatio from "@hooks/useVisiblePercentage";
import { NotionProject } from "@lib/notion";
import { parseInternalLink } from "@lib/utils";
import ScrollableTagList from "@molecules/ScrollableTagList";
import Link from "next/link";
import { memo } from "react";
import { FiEye } from "react-icons/fi";
import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";

export type NotionProjectItemProps = {
  project: NotionProject;
  projects: NotionProject[];
  index: number;
};

const NotionProjectItem = memo(
  ({ project, projects, index, ...rest }: NotionProjectItemProps) => {
    const { ref, visibleRatio } = useVisibleRatio();
    const isHalf = true;
    const internalLink = parseInternalLink(project.link || "");
    return (
      <div
        ref={ref}
        className={twMerge(
          "rounded-2xl p-4 md:p-6 lg:p-6 text-primary",
          !isHalf ? "col-span-12" : "col-span-12 md:col-span-6",
          "transition-all ease duration-400 bg-card"
        )}
        style={{
          // backgroundColor: project.background,
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
            <header className="flex items-center">
              <div className="grow">
                <h2 className="text-2xl">
                  <Balancer>
                    {project.platform == "web" ? (
                      <Link href={`/project/${project.slug}`} legacyBehavior>
                        {project.title}
                      </Link>
                    ) : (
                      project.title
                    )}
                  </Balancer>
                </h2>
                <p className="text-md md:mt-1 muted-text">
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <Fade
                className={twMerge("flex-shrink-0 flex-grow-0")}
                duration={300}
                delay={400}
              >
                {project.achievements && (
                  <div className="flex flex-gap-4">
                    {project.achievements.map((achievement, i) => (
                      <Badge
                        size="small"
                        key={i}
                        index={i}
                        content={achievement}
                      />
                    ))}
                  </div>
                )}
              </Fade>
            </header>
            <p className="mt-2 body-text md:mt-3">
              <Balancer ratio={0.67}>{project.tagline}</Balancer>
            </p>
            <ScrollableTagList
              tags={project.roles || []}
              background={"var(--bg-card)"}
              className="mt-4"
            />

            <div className="flex mt-6 space-x-4 md:mt-5">
              {project.caseStudy && (
                <Button scroll={false} href={`/project/${project.slug}`} arrow>
                  View project
                </Button>
              )}
              {project.postSlug && (
                <Button scroll={false} href={`/blog/${project.postSlug}`} arrow>
                  Read post
                </Button>
              )}
              {project.platform == "web" && !project.caseStudy && (
                <Button
                  scroll={false}
                  href={project.link ? project.link : "#"}
                  external={true}
                >
                  View website
                </Button>
              )}
              {project.caseStudy && project.link && !internalLink && (
                <Tooltip content={project.linkCta || "View website"}>
                  <IconButton href={project.link ? project.link : "#"} external>
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
            {project.cover &&
              project.cover.map((coverMedia) =>
                project.platform === "web" ? (
                  <BrowserFrame
                    url={project.link && project.link}
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
                    className={`relative transition-all ease-bounce w-full `}
                    key={coverMedia.url}
                  >
                    <CustomImage
                      src={coverMedia.url}
                      alt={project.title + " cover image"}
                      width={coverMedia.width}
                      height={coverMedia.height}
                    />
                  </div>
                )
              )}
          </Fade>
        </div>
      </div>
    );
  }
);

NotionProjectItem.displayName = "NotionProjectItem";
export default NotionProjectItem;
