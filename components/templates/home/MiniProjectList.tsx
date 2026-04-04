import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";
import SnapScrollContainer from "@molecules/SnapScrollContainer";
import { useInView } from "react-intersection-observer";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    initialInView: false,
    triggerOnce: true,
  });

  return (
    <section
      id="works"
      className="relative"
      ref={ref}
      style={
        {
          "--half-margin":
            "calc(var(--section-horizontal-padding) + (var(--vw) * 100 - var(--main-width)) / 2)",
        } as React.CSSProperties
      }
    >
      <Fade
        // className="main-container ml-0"
        delay={100}
        duration={200}
        show={inView}
      >
        <div className="main-container">
          <SectionTitle
            title="Featured works"
            action={
              <Button href="/work" variant="ghost">
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
          <Button
            href="/work"
            className="mt-6 w-full justify-center"
            variant="secondary"
          >
            View all projects
          </Button>
        </div>
      </Fade>
    </section>
  );
}
