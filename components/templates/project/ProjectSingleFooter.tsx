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
      <div className="bg-surface py-section-vertical border-divider relative border-t">
        <div className="main-container">
          {isShown && (
            <ReactionAndComment
              page={`project/${project.slug}`}
              lastEditedTime={project.lastEditedTime}
            ></ReactionAndComment>
          )}
          {/*{isShown && (
            <hr className="mt-section-vertical pt-section-vertical border-divider border-t"></hr>
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
