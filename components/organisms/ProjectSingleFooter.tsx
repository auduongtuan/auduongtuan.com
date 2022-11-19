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
      <div className="p-content bg-custom-neutral-900 text-white relative">
        <section className="main-container">
          <h2>Other projects</h2>
          <OtherProjectList projects={projects} />
        </section>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
