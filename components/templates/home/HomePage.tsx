import { Post, Project } from "@lib/notion";
import Header from "@molecules/header/Header";
import MiniPostList from "@templates/home/MiniPostList";
import MiniProductList from "@templates/home/MiniProductList";
import MiniProjectList from "@templates/home/MiniProjectList";

export type HomePageProps = {
  projects: Project[];
  posts: Post[];
};

export default function HomePage({ projects, posts }: HomePageProps) {
  const products = projects.filter((project) => {
    return project.tags.length > 0;
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
    </div>
  );
}
