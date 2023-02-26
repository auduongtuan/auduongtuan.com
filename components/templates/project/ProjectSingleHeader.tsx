import React, { useEffect } from "react";
import { Project } from "../../../lib/project";
import { FiEye } from "react-icons/fi";
import IconButton from "../../atoms/IconButton";
import Badge from "../../atoms/Badge";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Balancer from "react-wrap-balancer";
import Fade from "../../atoms/Fade";
interface ProjectSingleHeaderProps {
  project: Project;
}

export const ProjectSingleHeader = ({ project }: ProjectSingleHeaderProps) => {
  const { ref } = useHeaderInView();

  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-y-8 gap-4">
          <div
            className={`col-span-12 ${
              !project.meta.link && !project.meta.achievements
                ? "md:col-span-12"
                : "md:col-span-6"
            } md:row-span-1`}
          >
            <Fade slide duration={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight">
                {project.meta.title}
              </h1>
              <p className="mt-2 muted-text opacity-100 text-gray-500">
                {new Date(project.meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </Fade>
          </div>
          {project.meta.link && (
            <div className="col-span-12 md:col-span-6 md:row-span-1 md:justify-self-end relative">
              <IconButton
                size="medium"
                inverted
                content="View website"
                href={project.meta.link ? project.meta.link : "#"}
                external
              >
                <FiEye />
              </IconButton>
            </div>
          )}
          {project.meta.achievements && (
            <div className="col-span-12 md:col-span-6 md:row-span-1 md:justify-self-end relative">
              <div className="flex flex-gap-4 lg:absolute right-0">
                {project.meta.achievements.map((achievement, i) => (
                  <Badge key={i} index={i} content={achievement} />
                ))}
              </div>
            </div>
          )}
          <div className="col-span-12 grid grid-cols-2 gap-x-4 gap-y-8 md:col-start-1 md:col-span-4 md:row-span-3 md:self-end">
            <Fade className="col-span-1 md:col-span-2" delay={100}>
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
            <Fade className="col-span-1 md:col-span-2" delay={150}>
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

          <Fade as="p"
            slide
            delay={150}
            className={`col-span-12 ${
              project.meta.achievements ? "md:mt-28" : "md:mt-10"
            } md:col-start-5 md:col-span-8 md:row-span-3 md:self-end big-text`}
          >
            <Balancer ratio={0.36}>{project.meta.description}</Balancer>
          </Fade>
        </div>
      </div>
    </header>
  );
};
