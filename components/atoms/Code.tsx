import Highlight from "react-highlight";
import "highlight.js/styles/tokyo-night-dark.css";

export interface CodeHighlighterProps
  extends React.ComponentPropsWithRef<"pre"> {
  children: string;
  language: string;
}

const Code = ({ children, language, ...rest }: CodeHighlighterProps) => {
  return <Highlight className={`language-${language}`}>{children}</Highlight>;
};

export default Code;
