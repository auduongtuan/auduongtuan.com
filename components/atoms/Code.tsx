import Prism from "prismjs";
import { useEffect } from "react";

export interface CodeHighlighterProps extends React.ComponentPropsWithRef<'pre'> {
  children: string;
  language: string;
}
const Code = ({children, language, ...rest}: CodeHighlighterProps) => {
  useEffect(() => {
    if (language in Prism.languages) {
      // Prism.highlight(children, Prism.languages[language], language);
    }
  }, [children, language]);
  return <pre>
    <code className={`language-${language}`}>{encodeURI(children)}</code>
  </pre>;
}
export default Code;