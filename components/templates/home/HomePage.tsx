import Header from "@molecules/header/Header";
import Footer from "@molecules/Footer";
import { NotionProject } from "@lib/notion/project";
import NotionProjectList from "@templates/project/NotionProjectList";

export type HomePageProps = {
  notionProjects: NotionProject[];
};
export default function HomePage({ notionProjects }: HomePageProps) {
  return (
    <div>
      <Header />
      <NotionProjectList projects={notionProjects} />
      <Footer />
    </div>
  );
}
