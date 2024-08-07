import ContentMenu from "@molecules/ContentMenu";
import Fade from "@atoms/Fade";
import { NotionProject } from "@lib/notion";
import parseBlocks from "@notion/parseBlocks";
import usePasswordProtectStore from "@store/usePasswordProtectStore";
import { Transition } from "@headlessui/react";
import PasswordProtect from "@molecules/PasswordProtect";

// add key to make it re-render with animation
// https://stackoverflow.com/questions/63186710/how-to-trigger-a-css-animation-on-every-time-a-react-component-re-renders
const ProjectSingleContent = ({
  project,
  notionContent,
}: {
  project: NotionProject;
  notionContent: any;
}) => {
  const { decryptedContent } = usePasswordProtectStore();
  return (
    <div
      // remove bg color for clearer content
      className="relative p-content"
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
              enter="transition-all duration-1000"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <div className="project-grid">
                {parseBlocks(decryptedContent, project.assets)}
              </div>
            </Transition>
            <Transition
              show={decryptedContent == null}
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="content-container">
                <PasswordProtect
                  encryptedContent={notionContent}
                  mode="project"
                />
              </div>
            </Transition>
          </>
        ) : (
          <div className="project-grid">
            {parseBlocks(notionContent, project.assets)}
          </div>
        )}
      </Fade>
    </div>
  );
};

export default ProjectSingleContent;
