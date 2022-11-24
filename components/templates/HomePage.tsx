import { Post } from "../../lib/blog";
import { Project } from "../../lib/project";
import ProjectList from "../organisms/ProjectList";
import PostList from "../organisms/PostList";

import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Navigation from "../organisms/Navigation";
import { useAppContext } from "../../lib/context/AppContext";
import HeadMeta from "../atoms/HeadMeta";

export type HomePageProps = {
  posts: Post[];
  projects: Project[];
};
export default function HomePage({ posts, projects }: HomePageProps) {
  const appContext = useAppContext();
  return (
    <div>
      <HeadMeta />
      <Header />
      <ProjectList projects={projects} />
      {/* <PostList posts={posts} /> */}
      <Footer />
    </div>
  );
}
