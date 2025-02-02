import Badge from "@atoms/Badge";
import Balancer from "react-wrap-balancer";
import Fade from "@atoms/Fade";
import useBreakpoint from "@hooks/useBreakpoint";
import { twMerge } from "tailwind-merge";
import { Project } from "@lib/notion";
import HeaderWithBackButton from "@molecules/HeaderWithBackButton";
import Button from "@atoms/Button";
interface ProjectSingleHeaderProps {
  project: Project;
}

export const ProjectSingleHeader = ({ project }: ProjectSingleHeaderProps) => {
  const bp = useBreakpoint();
  return (
    <header className="text-primary bg-surface border-divider z-10 w-full border-b">
      {/* <div className="flex justify-center p-0 lg:px-section-horizontal main-container py-section-vertical"> */}
      <HeaderWithBackButton backLink="/work" backLinkLabel="Back to Work">
        <div
          className="grid grid-cols-12 gap-x-4"
          key={project.slug + "_header"}
        >
          <div className="col-span-12 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Fade duration={200} slide className="grow">
              <h1 className="h1">{project.title}</h1>
              <p className="muted-text mt-1 md:mt-2">
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </Fade>
            {(project.link ||
              (project.achievements && project.achievements.length > 0)) && (
              <Fade
                className={twMerge(
                  "flex shrink-0 grow-0",
                  project.achievements && bp == "sm" && "mt-2 w-full",
                )}
                duration={300}
                delay={400}
              >
                {project.link && (
                  <Button href={project.link} secondary showPopoutIcon>
                    View website
                  </Button>
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
          <Fade as="p" delay={200} className={`body-text col-span-12 mt-4`}>
            <Balancer ratio={0.36}>{project.description}</Balancer>
          </Fade>

          <div className="space-4 col-span-12 mt-6 flex md:mt-8">
            <Fade className="grow" delay={350}>
              <h5 className="subheading2">My contribution</h5>
              <ul className="leading-tight">
                {project.roles &&
                  project.roles.map((role, i) => (
                    <li className="mt-3" key={i}>
                      {role}
                    </li>
                  ))}
              </ul>
            </Fade>
            <Fade className="grow" delay={300}>
              <h5 className="subheading2">Tools used</h5>
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
