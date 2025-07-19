import Header from "@molecules/header/Header";
import Footer from "@molecules/Footer";
import MiniProjectList from "@templates/home/MiniProjectList";
import MiniProductList from "@templates/home/MiniProductList";
import MiniPostList from "@templates/home/MiniPostList";
import Services from "@templates/home/Services";
import { Post, Project } from "@lib/notion";

export type HomePageProps = {
  projects: Project[];
  posts: Post[];
};

export default function HomePage({ projects, posts }: HomePageProps) {
  const products = projects.filter((project) => {
    project.tags.includes("my product");
  });
  return (
    <div className="bg-surface">
      <Header />
      <div className="py-section-vertical gap-section-vertical flex flex-col">
        {/* <Services></Services> */}
        <MiniProductList products={products} />
        <MiniPostList posts={posts} />
        <MiniProjectList projects={projects} />
      </div>
      <Footer />
    </div>
  );
}
