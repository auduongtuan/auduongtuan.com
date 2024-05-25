import Header from "@molecules/header/Header";
import Footer from "@molecules/Footer";
import { NotionProject } from "@lib/notion/project";
import ProjectList from "@templates/project/ProjectList";

export type HomePageProps = {
  notionProjects: NotionProject[];
};

export default function HomePage({ notionProjects }: HomePageProps) {
  return (
    <div className="bg-surface">
      <Header />
      <ProjectList projects={notionProjects} />
      <Footer />
    </div>
  );
}
