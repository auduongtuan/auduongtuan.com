import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section id="works">
      <Fade className="main-container" delay={500} duration={200}>
        <SectionTitle
          title="Featured works"
          action={
            <Button href="/work" secondary>
              View all
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projects
            .sort((a, b) => b.point - a.point)
            .slice(0, 6)
            .map((project, i) => (
              <ProjectCard
                key={`{project.slug}-${i}`}
                index={i}
                project={project}
                projects={projects}
              />
            ))}
        </div>
        <Button href="/work" className="justify-center w-full mt-6" secondary>
          View all projects
        </Button>
      </Fade>
    </section>
  );
}
