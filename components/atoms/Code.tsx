"use client";
import { useState, useRef, useCallback } from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-light.css";
import { cn } from "@lib/utils/cn";
import IconButton from "./IconButton";
import { FiCheck, FiCopy } from "react-icons/fi";
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
  const [open, setOpen] = useState(false);

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(children).then(() => {
        setCopied(true);
        // setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = children;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        // setTimeout(() => setCopied(false), 2000);
      } catch (err) {}
      document.body.removeChild(textArea);
    }
  }, [children]);

  return (
    <div className={cn("group relative text-[0.8em]", className)}>
      <Tooltip
        open={open}
        content={copied ? "Copied!" : "Copy"}
        onOpenChange={(open, _ev, reason) => {
          if (reason == "trigger-press" && !open) {
            return;
          }
          if (!open) setCopied(false);
          setOpen(open);
        }}
      >
        <IconButton
          size="small"
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 backdrop-blur-3xl transition-all group-hover:opacity-100"
        >
          {copied ? <FiCheck /> : <FiCopy />}
        </IconButton>
      </Tooltip>
      <Highlight className={`language-${language}`}>{children}</Highlight>
    </div>
  );
};

export default Code;
