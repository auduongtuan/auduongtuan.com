import React, { Fragment } from "react";
import { Project } from "../../lib/project";

import ReactionAndComment from "../molecules/ReactionAndComment";
import OtherProjectList from "../molecules/OtherProjectList";
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
      <div className=" bg-gray-200 p-content space-y-8">
        <div className="main-container">
          <ReactionAndComment
            page={`project/${project.slug}`}
          ></ReactionAndComment>
        </div>
      </div>
      <div className="p-content  relative">
        <section className="main-container">
          <h3>Other projects</h3>
          <OtherProjectList projects={projects} />
        </section>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
