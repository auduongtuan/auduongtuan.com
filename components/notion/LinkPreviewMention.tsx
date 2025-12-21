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
    <InlineLink href={url} target="_blank" rel="noopener noreferrer">
      {favicon && (
        <img
          src={favicon}
          alt=""
          className="mr-0.5 inline-block h-4 w-4 align-text-bottom"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      {displayText}
    </InlineLink>
  );
};

export default LinkPreviewMention;
