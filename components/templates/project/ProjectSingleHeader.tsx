import React, { useEffect } from "react";
import { Project } from "../../../lib/project";
import { FiArrowLeft, FiChevronLeft, FiEye } from "react-icons/fi";
import IconButton from "../../atoms/IconButton";
import Badge from "../../atoms/Badge";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Balancer from "react-wrap-balancer";
import Fade from "../../atoms/Fade";
import InlineLink from "../../atoms/InlineLink";
import useBreakpoint from "../../../hooks/useBreakpoint";
import { twMerge } from "tailwind-merge";
interface ProjectSingleHeaderProps {
  project: Project;
}

export const ProjectSingleHeader = ({ project }: ProjectSingleHeaderProps) => {
  const { ref } = useHeaderInView();
  const bp = useBreakpoint();
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-x-4 content-container p-0">
          {/* <div className="hidden md:block col-span-4 self-center group row-span-full">
            <InlineLink href="/" underline={false} dark={true} className="opacity-0 group-hover:opacity-100"><FiArrowLeft />All projects</InlineLink>
          </div> */}
          <div className="col-span-12 flex flex-gap-x-4 items-center flex-wrap">
            <Fade duration={200} slide className="flex-grow">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-tight">
                {project.meta.title}
              </h1>
              <p className="mt-1 md:mt-2 muted-text opacity-100 text-gray-500">
                {new Date(project.meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </Fade>
            {(project.meta.link || project.meta.achievements) && (
              <Fade className={twMerge("flex-shrink-0 flex-grow-0", project.meta.achievements && bp == 'sm' && "mt-2 w-full")} duration={300} delay={400}>
                {project.meta.link && (
                  <IconButton
                    size={bp == 'sm' ? "small" : "medium"}
                    inverted
                    content="View website"
                    href={project.meta.link ? project.meta.link : "#"}
                    external
                  >
                    <FiEye />
                  </IconButton>
                )}
                {project.meta.achievements && (
                  <div className="flex flex-gap-4">
                    {project.meta.achievements.map((achievement, i) => (
                      <Badge key={i} index={i} content={achievement} />
                    ))}
                  </div>
                )}
              </Fade>
            )}
          </div>
          <Fade
            as="p"
            delay={200}
            className={`col-span-12 mt-4 big-body-text`}
          >
            <Balancer ratio={0.36}>{project.meta.description}</Balancer>
          </Fade>

          <div className="col-span-12 flex space-4 mt-6 md:mt-8">
            <Fade className="flex-grow" delay={300}>
              <h5 className="sub-heading text-sm">Tools used</h5>
              <ul className="leading-tight">
                {project.meta.tools &&
                  project.meta.tools.map((tool, i) => (
                    <li className="mt-3" key={i}>
                      {tool}
                    </li>
                  ))}
              </ul>
            </Fade>
            <Fade className="flex-grow" delay={350}>
              <h5 className="sub-heading text-sm">What I did</h5>
              <ul className="leading-tight">
                {project.meta.roles &&
                  project.meta.roles.map((role, i) => (
                    <li className="mt-3" key={i}>
                      {role}
                    </li>
                  ))}
              </ul>
            </Fade>
          </div>
        </div>
      </div>
    </header>
  );
};
