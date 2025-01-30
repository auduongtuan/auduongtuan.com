import { FiEye } from "react-icons/fi";
import IconButton from "@atoms/IconButton";
import Badge from "@atoms/Badge";
import Balancer from "react-wrap-balancer";
import Fade from "@atoms/Fade";
import useBreakpoint from "@hooks/useBreakpoint";
import { twMerge } from "tailwind-merge";
import Tooltip from "@atoms/Tooltip";
import { Project } from "@lib/notion";
import HeaderWithBackButton from "@molecules/HeaderWithBackButton";
import Button from "@atoms/Button";
interface ProjectSingleHeaderProps {
  project: Project;
}

export const ProjectSingleHeader = ({ project }: ProjectSingleHeaderProps) => {
  const bp = useBreakpoint();
  return (
    <header className="z-10 w-full border-b text-primary bg-surface border-divider">
      {/* <div className="flex justify-center p-0 lg:px-section-horizontal main-container p-header"> */}
      <HeaderWithBackButton backLink="/work" backLinkLabel="Back to Work">
        <div
          className="grid grid-cols-12 gap-x-4"
          key={project.slug + "_header"}
        >
          <div className="flex flex-wrap items-center col-span-12 gap-x-4 gap-y-2">
            <Fade duration={200} slide className="flex-grow">
              <h1 className="font-sans text-3xl tracking-tight md:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-1 md:mt-2 muted-text">
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </Fade>
            {(project.link || project.achievements) && (
              <Fade
                className={twMerge(
                  "flex-shrink-0 flex-grow-0 flex",
                  project.achievements && bp == "sm" && "mt-2 w-full"
                )}
                duration={300}
                delay={400}
              >
                {project.link && (
                  <Button href={project.link} secondary showPopoutIcon>
                    View website
                  </Button>
                  // <Tooltip content="View website">
                  //   <IconButton
                  //     size={bp == "sm" ? "small" : "medium"}
                  //     // inverted
                  //     href={project.link ? project.link : "#"}
                  //     external
                  //   >
                  //     <FiEye />
                  //   </IconButton>
                  // </Tooltip>
                )}
                {project.achievements && project.achievements.length > 0 && (
                  <div className="flex gap-4">
                    {project.achievements.map((achievement, i) => (
                      <Badge key={i} index={i} content={achievement} />
                    ))}
                  </div>
                )}
              </Fade>
            )}
          </div>
          <Fade as="p" delay={200} className={`col-span-12 mt-4 body-text`}>
            <Balancer ratio={0.36}>{project.description}</Balancer>
          </Fade>

          <div className="flex col-span-12 mt-6 space-4 md:mt-8">
            <Fade className="flex-grow" delay={350}>
              <h5 className="text-sm sub-heading">My contribution</h5>
              <ul className="leading-tight">
                {project.roles &&
                  project.roles.map((role, i) => (
                    <li className="mt-3" key={i}>
                      {role}
                    </li>
                  ))}
              </ul>
            </Fade>
            <Fade className="flex-grow" delay={300}>
              <h5 className="text-sm sub-heading">Tools used</h5>
              <ul className="leading-tight">
                {project.tools &&
                  project.tools.map((tool, i) => (
                    <li className="mt-3" key={i}>
                      {tool}
                    </li>
                  ))}
              </ul>
            </Fade>
          </div>
        </div>
      </HeaderWithBackButton>
    </header>
  );
};
