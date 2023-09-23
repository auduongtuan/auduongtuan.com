import React, { Fragment } from "react";
import { Project } from "@lib/project";

import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import OtherProjectList from "./OtherProjectList";
interface ProjectSingleFooterProps {
  projects: Project[];
  project: Project;
}

const ProjectSingleFooter = ({
  projects,
  project,
}: ProjectSingleFooterProps) => {
  return (
    <Fragment>
      <div className="bg-white border-gray-200 border-t p-content relative">
        <div className="main-container">
          <ReactionAndComment
            page={`project/${project.slug}`}
          ></ReactionAndComment>
          <div className="relative border-gray-200 border-t mt-10 md:mt-16 pt-10 md:pt-12">
            <OtherProjectList projects={projects} project={project} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
