import Header from "@molecules/header/Header";
import Footer from "@molecules/Footer";
import { Project } from "@lib/notion/project";
import ProjectList from "@templates/project/ProjectList";
import { useHeaderInView } from "@hooks";
import Fade from "@atoms/Fade";

export type WorksPageProps = {
  projects: Project[];
};

export default function WorkPage({ projects }: WorksPageProps) {
  const { ref } = useHeaderInView();
  return (
    <div className="bg-surface">
      <header ref={ref} className="z-10 w-full text-primary bg-surface ">
        <div className="main-container p-header pb-section-vertical">
          <div className="grid grid-cols-12 gap-2 md:gap-4">
            <Fade
              as="h1"
              className="col-span-12 md:col-span-8"
              slide
              duration={100}
            >
              Work
            </Fade>
            <div className="self-end col-span-12 md:col-span-8">
              <Fade
                as="p"
                className="page-description"
                slide
                duration={200}
                delay={100}
              >
                A collection of my best work
              </Fade>
            </div>
          </div>
        </div>
      </header>
      <ProjectList projects={projects} className="pb-subsection-vertical" />
      <Footer />
    </div>
  );
}
