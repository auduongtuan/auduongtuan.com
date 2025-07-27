import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";
import SnapScrollContainer from "@molecules/SnapScrollContainer";

export default function ProjectList({ projects }: { projects: Project[] }) {

  return (
    <section
      id="works"
      className="relative"
      style={
        {
          "--half-margin":
            "calc(var(--section-horizontal-padding) + (var(--vw) * 100 - var(--main-width)) / 2)",
        } as React.CSSProperties
      }
    >
      <Fade
        // className="main-container ml-0"
        delay={500}
        duration={200}
      >
        <div className="main-container">
          <SectionTitle
            title="Featured works"
            action={
              <Button href="/work" secondary>
                View all
              </Button>
            }
          />
        </div>
        <SnapScrollContainer trackingEvent="scroll_project_list">
          {projects
            .sort((a, b) => b.point - a.point)
            .slice(0, 6)
            .map((project, i) => (
              <ProjectCard
                key={`{project.slug}-${i}`}
                index={i}
                project={project}
                projects={projects}
                className="w-[calc(min(440px,var(--vw)*100-var(--section-horizontal-padding)*2-60px))] shrink-0 translate-x-(--half-margin)"
              />
            ))}
        </SnapScrollContainer>
        <div className="main-container">
          <Button href="/work" className="mt-6 w-full justify-center" secondary>
            View all projects
          </Button>
        </div>
      </Fade>
    </section>
  );
}
