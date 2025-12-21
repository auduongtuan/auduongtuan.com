import InlineLink from "@atoms/InlineLink";
import Image from "next/image";

type LinkPreviewMentionProps = {
  url: string;
  displayText: string;
  favicon?: string;
};

const LinkPreviewMention = ({
  url,
  displayText,
  favicon,
}: LinkPreviewMentionProps) => {
  return (
    <InlineLink href={url} className="inline-flex items-center gap-1">
      {favicon && (
        <Image
          src={favicon}
          alt=""
          width={16}
          height={16}
          className="inline-block"
        />
      )}
      <span>{displayText}</span>
    </InlineLink>
  );
};

export default LinkPreviewMention;
