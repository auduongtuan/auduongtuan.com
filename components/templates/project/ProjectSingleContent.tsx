import React, { useCallback } from "react";
import ContentMenu from "../../molecules/ContentMenu";
import { MDXRemote } from "next-mdx-remote";
import ProjectComponents from "./ProjectComponents";
import { Project } from "../../../lib/project";
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
      <article id="project" className="main-container">
        <div className="project-grid">
          <MDXRemote
            {...project.parsedContent}
            components={ProjectComponents(project.slug)}
          />
        </div>
      </article>
    </div>
  );
};
export default ProjectSingleContent;
