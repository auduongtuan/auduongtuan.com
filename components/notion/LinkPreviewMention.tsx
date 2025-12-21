import React from "react";
import InlineLink from "@atoms/InlineLink";

interface LinkPreviewMentionProps {
  url: string;
  displayText: string;
  favicon?: string | null;
}

export const LinkPreviewMention: React.FC<LinkPreviewMentionProps> = ({
  url,
  displayText,
  favicon,
}) => {
  return (
    <InlineLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="max-w-full min-w-0 overflow-hidden break-all text-ellipsis whitespace-nowrap"
    >
      {favicon && (
        <img
          src={favicon}
          alt={displayText + " favicon"}
          className="inline-block h-4 w-4 align-text-bottom"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <span className="min-w-0 shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {displayText}
      </span>
    </InlineLink>
  );
};

export default LinkPreviewMention;
