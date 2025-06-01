import ContentMenu from "@molecules/ContentMenu";
import Fade from "@atoms/Fade";
import { Project } from "@lib/notion";
import parseBlocks from "@notion/parseBlocks";
import usePasswordProtectStore from "@store/usePasswordProtectStore";
import { Transition } from "@atoms/Transition";
import PasswordProtect from "@molecules/PasswordProtect";
import { PasswordInfo } from "@lib/notion/password";

// add key to make it re-render with animation
// https://stackoverflow.com/questions/63186710/how-to-trigger-a-css-animation-on-every-time-a-react-component-re-renders
const ProjectSingleContent = ({
  project,
  notionContent,
  passwordInfo,
}: {
  project: Project;
  notionContent: any;
  passwordInfo: PasswordInfo;
}) => {
  const { decryptedContent } = usePasswordProtectStore();
  return (
    <div
      // remove bg color for clearer content
      className="py-section-vertical relative"
      key={project.slug + "_content"}
      // style={{
      //   background:
      //     project.meta.contentBackground && project.meta.contentBackground,
      // }}
    >
      <ContentMenu />
      <Fade as="article" id="project" className="main-container" delay={200}>
        {project.protected ? (
          <>
            <Transition
              show={decryptedContent != null}
              starting="opacity-0"
              ending="opacity-0"
              className="content-blocks-grid transition-all duration-1000"
            >
              <div>{parseBlocks(decryptedContent, project.assets)}</div>
            </Transition>
            <Transition
              show={decryptedContent == null}
              ending="opacity-0"
              className="content-container transition-opacity duration-300"
            >
              <PasswordProtect
                encryptedContent={notionContent}
                mode="project"
                passwordInfo={passwordInfo}
              />
            </Transition>
          </>
        ) : (
          <div className="content-blocks-grid">
            {parseBlocks(notionContent, project.assets)}
          </div>
        )}
      </Fade>
    </div>
  );
};

export default ProjectSingleContent;
