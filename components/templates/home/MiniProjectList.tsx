import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section id="works">
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
        <div
          className="scrollbar-hidden max-w-full snap-x overflow-x-scroll"
          style={
            {
              "--half-margin":
                "calc(var(--section-horizontal-padding) + (var(--vw) * 100 - var(--main-width)) / 2)",
            } as React.CSSProperties
          }
        >
          <div className="flex">
            <div className="flex shrink-0 gap-6">
              {projects
                .sort((a, b) => b.point - a.point)
                .slice(0, 6)
                .map((project, i) => (
                  <div
                    key={`{project.slug}-${i}`}
                    className="flex snap-start last:pr-[calc(var(--half-margin)*2)]"
                  >
                    <ProjectCard
                      key={`{project.slug}-${i}`}
                      index={i}
                      project={project}
                      projects={projects}
                      className="w-[calc(min(440px,var(--vw)*100-var(--section-horizontal-padding)*2-60px))] shrink-0 translate-x-(--half-margin)"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="main-container">
          <Button href="/work" className="mt-6 w-full justify-center" secondary>
            View all projects
          </Button>
        </div>
      </Fade>
    </section>
  );
}
