import React, { useCallback } from "react";
import ContentMenu from "../../molecules/ContentMenu";
import { MDXRemote } from "next-mdx-remote";
import ProjectComponents from "./ProjectComponents";
import { Project } from "../../../lib/project";
import Fade from "../../atoms/Fade";
// add key to make it re-render with animation
// https://stackoverflow.com/questions/63186710/how-to-trigger-a-css-animation-on-every-time-a-react-component-re-renders
const ProjectSingleContent = ({ project }: { project: Project }) => {
  return (
    <div
      className="p-content bg-gray-100 relative"
      key={project.slug+'_content'}
      style={{
        background:
          project.meta.contentBackground && project.meta.contentBackground,
      }}
    >
      <ContentMenu />
      <Fade as="article" id="project" className="main-container" delay={200}>
        <div className="project-grid">
          <MDXRemote
            {...project.parsedContent}
            components={ProjectComponents(project.slug)}
          />
        </div>
      </Fade>
    </div>
  );
};
export default ProjectSingleContent;
