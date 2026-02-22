import { Project } from "@lib/notion";
import ReactionAndComment from "@molecules/comment/ReactionAndComment";
import usePasswordProtectStore from "@store/usePasswordProtectStore";
import { Fragment } from "react";
import OtherProjectList from "./OtherProjectList";

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
      <div className="bg-surface py-section-vertical relative border-t border-gray-200">
        <div className="main-container">
          {isShown && (
            <ReactionAndComment
              page={`project/${project.slug}`}
              lastEditedTime={project.lastEditedTime}
            ></ReactionAndComment>
          )}
          {/*{isShown && (
            <hr className="mt-section-vertical pt-section-vertical border-gray-200 border-t"></hr>
          )}*/}
          <div className="pt-section-vertical relative">
            <OtherProjectList projects={projects} project={project} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default ProjectSingleFooter;
