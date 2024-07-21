import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-light.css";
import { twMerge } from "tailwind-merge";

export interface CodeHighlighterProps
  extends React.ComponentPropsWithRef<"pre"> {
  children: string;
  language: string;
}

const Code = ({
  children,
  language,
  className,
  ...rest
}: CodeHighlighterProps) => {
  return (
    <Highlight className={twMerge(`language-${language}`, className)}>
      {children}
    </Highlight>
  );
};

export default Code;
