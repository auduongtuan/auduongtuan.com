import React, { Fragment } from "react";
import { Project } from "@lib/notion";
import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import OtherProjectList from "./OtherProjectList";
import usePasswordProtectStore from "@store/usePasswordProtectStore";
interface ProjectSingleFooterProps {
  projects: Project[];
  project: Project;
}

const ProjectSingleFooter = ({
  projects,
  project,
}: ProjectSingleFooterProps) => {
  const { decryptedContent } = usePasswordProtectStore();
  const isShown = !project.protected || decryptedContent != null;

  return (
    <Fragment>
      <div className="relative border-t border-gray-200 bg-surface py-section-vertical">
        <div className="main-container">
          {isShown && (
            <ReactionAndComment
              page={`project/${project.slug}`}
            ></ReactionAndComment>
          )}
          {isShown && (
            <hr className="pt-10 mt-10 border-t border-gray-200 md:mt-16 md:pt-12"></hr>
          )}
          <div className="relative ">
            <OtherProjectList projects={projects} project={project} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
