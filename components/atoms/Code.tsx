"use client";
import { useState, useRef } from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-light.css";
import { cn } from "@lib/utils/cn";
import IconButton from "./IconButton";
import { FiCopy } from "react-icons/fi";
import Tooltip from "./Tooltip";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(children).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = children;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback: Copy failed", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={cn("text-[0.8em] relative group", className)}>
      <Tooltip content={copied ? "Copied!" : "Copy"}>
        <IconButton
          size="small"
          onClick={handleCopy}
          className="absolute transition-all opacity-0 right-3 top-3 group-hover:opacity-100"
        >
          <FiCopy />
        </IconButton>
      </Tooltip>
      <Highlight className={`language-${language}`}>{children}</Highlight>
    </div>
  );
};

export default Code;
