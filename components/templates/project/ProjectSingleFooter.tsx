import React, { Fragment } from "react";
import { NotionProject } from "@lib/notion";
import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import OtherProjectList from "./OtherProjectList";
interface ProjectSingleFooterProps {
  projects: NotionProject[];
  project: NotionProject;
}

const ProjectSingleFooter = ({
  projects,
  project,
}: ProjectSingleFooterProps) => {
  return (
    <Fragment>
      <div className="relative bg-white border-t border-gray-200 p-content">
        <div className="main-container">
          <ReactionAndComment
            page={`project/${project.slug}`}
          ></ReactionAndComment>
          <div className="relative pt-10 mt-10 border-t border-gray-200 md:mt-16 md:pt-12">
            <OtherProjectList projects={projects} project={project} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
