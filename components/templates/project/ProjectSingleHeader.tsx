import { FiEye } from "react-icons/fi";
import IconButton from "@atoms/IconButton";
import Badge from "@atoms/Badge";
import useHeaderInView from "@hooks/useHeaderInView";
import Balancer from "react-wrap-balancer";
import Fade from "@atoms/Fade";
import useBreakpoint from "@hooks/useBreakpoint";
import { twMerge } from "tailwind-merge";
import Tooltip from "@atoms/Tooltip";
import { NotionProject } from "@lib/notion";
import BackToPreviousPage from "@molecules/BackToPreviousPage";
interface ProjectSingleHeaderProps {
  project: NotionProject;
}

export const ProjectSingleHeader = ({ project }: ProjectSingleHeaderProps) => {
  const { ref } = useHeaderInView();
  const bp = useBreakpoint();
  return (
    <header
      ref={ref}
      className="z-10 w-full border-b text-primary bg-surface border-divider"
    >
      <div className="flex justify-center p-0 lg:px-container main-container p-header">
        <Fade
          duration={100}
          className="hidden w-8 lg:block p-header grow-0 shrink"
        >
          <BackToPreviousPage
            defaultLink="/"
            defaultLinkLabel="Back to Works"
          />
        </Fade>
        <div
          className="grid grid-cols-12 grow content-container p-header gap-x-4"
          key={project.slug + "_header"}
        >
          <div className="flex flex-wrap items-center col-span-12 flex-gap-x-4">
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
                  <Tooltip content="View website">
                    <IconButton
                      size={bp == "sm" ? "small" : "medium"}
                      // inverted
                      href={project.link ? project.link : "#"}
                      external
                    >
                      <FiEye />
                    </IconButton>
                  </Tooltip>
                )}
                {project.achievements && (
                  <div className="flex flex-gap-4">
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
        <div className="hidden w-8 lg:block p-header grow-0 shrink"></div>
      </div>
    </header>
  );
};
