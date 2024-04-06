import React, { useCallback } from "react";
import ContentMenu from "@molecules/ContentMenu";
import { MDXRemote } from "next-mdx-remote";
import ProjectComponents from "./ProjectComponents";
import Fade from "@atoms/Fade";
import { NotionProject } from "@lib/notion";
import parseBlocks from "@notion/parseBlocks";
// add key to make it re-render with animation
// https://stackoverflow.com/questions/63186710/how-to-trigger-a-css-animation-on-every-time-a-react-component-re-renders
const ProjectSingleContent = ({
  project,
  mdxContent,
  notionContent,
}: {
  project: NotionProject;
  mdxContent: any;
  notionContent: any;
}) => {
  return (
    <div
      // remove bg color for clearer content
      className="relative p-content"
      key={project.slug + "_content"}
      // style={{
      //   background:
      //     project.meta.contentBackground && project.meta.contentBackground,
      // }}
    >
      <ContentMenu />
      <Fade as="article" id="project" className="main-container" delay={200}>
        {mdxContent && (
          <div className="project-grid">
            <MDXRemote
              {...mdxContent}
              components={ProjectComponents(project.slug)}
            />
          </div>
        )}
        {notionContent &&   <div className="project-grid">{parseBlocks(notionContent)}</div>}
      </Fade>
    </div>
  );
};
export default ProjectSingleContent;
