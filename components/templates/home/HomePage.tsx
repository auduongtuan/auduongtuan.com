import { Post } from "../../../lib/blog";
import { Project } from "../../../lib/project";
import ProjectList from "../project/ProjectList";
import PostList from "../post/PostList";

import Header from "../../molecules/header/Header";
import Footer from "../../molecules/Footer";
import Navigation from "../../molecules/Navigation";
import HeadMeta from "../../atoms/HeadMeta";

export type HomePageProps = {
  posts: Post[];
  projects: Project[];
};
export default function HomePage({ posts, projects }: HomePageProps) {
  return (
    <div>
      <Header />
      <ProjectList projects={projects} />
      {/* <PostList posts={posts} /> */}
      <Footer />
    </div>
  );
}
