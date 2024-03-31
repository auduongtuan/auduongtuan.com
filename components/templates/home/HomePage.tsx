import { Post } from "@lib/blog";
import { Project } from "@lib/project";
import ProjectList from "../project/ProjectList";
import PostList from "../post/PostList";

import Header from "@molecules/header/Header";
import Footer from "@molecules/Footer";
import Navigation from "@molecules/Navigation";
import HeadMeta from "@atoms/HeadMeta";
import { NotionProject } from "@lib/notion/project";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import BrowserFrame from "@atoms/Frame";
import { twMerge } from "tailwind-merge";
import NotionProjectList from "@templates/project/NotionProjectList";

export type HomePageProps = {
  posts: Post[];
  projects: Project[];
  notionProjects: NotionProject[];
};
export default function HomePage({
  posts,
  projects,
  notionProjects,
}: HomePageProps) {
  console.log(notionProjects);
  // const renderCover = (project: NotionProject) => {
  //   return (
  //     project.meta.cover &&
  //     project.meta.cover.map((cover) => (
  //       <div key={cover.url} className={cover.type == "video" ? "w-full" : ""}>
  //         {cover.type === "image" ? (
  //           <CustomImage
  //             src={cover.url}
  //             alt={project.title + " cover image"}
  //             width={cover.width}
  //             height={cover.height}
  //           />
  //         ) : (
  //           <CustomVideo
  //             src={cover.url}
  //             width={cover.width}
  //             height={cover.height}
  //             className="w-full"
  //           ></CustomVideo>
  //         )}
  //       </div>
  //     ))
  //   );
  // };
  return (
    <div>
      <Header />
      {/* <div className="flex flex-col gap-10 main-container">
        {notionProjects.map((project) => (
          <article
            key={project.id}
            className="grid items-center grid-cols-3 px-4 py-10"
          >
            <div className="col-span-1">
              <h3>{project.title}</h3>
              <p>
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <p>{project.tagline}</p>
            </div>
            {project.meta.cover && (
              <div
                className={twMerge(
                  "flex flex-gap-4 items-center justify-center w-full col-span-2",
                  project.type != "web" &&
                    "[&_img]:w-auto [&_img]:max-h-[400px] [&_img]:object-contain"
                )}
              >
                {project.type == "web" ? (
                  <BrowserFrame>{renderCover(project)}</BrowserFrame>
                ) : (
                  renderCover(project)
                )}
              </div>
            )}
          </article>
        ))}
      </div> */}
      <NotionProjectList projects={notionProjects} />
      {/* <PostList posts={posts} /> */}

      <Footer />
    </div>
  );
}
