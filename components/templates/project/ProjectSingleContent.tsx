import React, { useCallback } from "react";
import ContentMenu from "../../molecules/ContentMenu";
import { MDXRemote } from "next-mdx-remote";
import ProjectComponents from "./ProjectComponents";
import { Project } from "../../../lib/project";
import Fade from "../../atoms/Fade";
const ProjectSingleContent = ({ project }: { project: Project }) => {
  return (
    <div
      className="p-content pt-0 bg-gray-100 relative"
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
