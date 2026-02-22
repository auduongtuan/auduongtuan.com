import PillButton from "@atoms/PillButton";
import Skeleton from "@atoms/Skeleton";
import Tooltip from "@atoms/Tooltip";
import { type CommentSuggestion } from "@lib/commentSuggestion";
import { useState } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import CommentTagScrollContainer from "./CommentTagScrollContainer";
import { useAxiosSWR } from "@hooks/index";

function getComments(
  suggestion: CommentSuggestion,
  language: "vietnamese" | "english",
) {
  const sets = suggestion[language] as string[][];
  return sets[Math.floor(Math.random() * sets.length)] || [];
}

const CommentSuggestion = ({
  onButtonClick,
  page,
  lastEditedTime,
}: {
  onButtonClick: (content: string) => void;
  page: string;
  lastEditedTime: number | string;
}) => {
  const { data: suggestion } = useAxiosSWR<CommentSuggestion>([
    "/api/comment-suggestion",
    { page, lastEditedTime },
  ]);

  const [useEnglish, setUseEnglish] = useState(false);
  const comments = suggestion
    ? getComments(suggestion, useEnglish ? "english" : "vietnamese")
    : [];

  return (
    <div>
      <p className="muted-text mb-2 flex items-center gap-2">
        <Tooltip
          content={"AI-generated content powered by Gemini. Use cautiously."}
        >
          <RiAiGenerate2 className="hover:text-accent inline-block h-4 w-4" />
        </Tooltip>
        Suggestion{" "}
        <Tooltip
          content={useEnglish ? "Switch to Vietnamese" : "Switch to English"}
        >
          <button
            // active={useEnglish}
            onClick={() => setUseEnglish(!useEnglish)}
            className="self-end"
          >
            {useEnglish ? "🇺🇸" : "🇻🇳"}
          </button>
        </Tooltip>
      </p>
      <Skeleton.Wrapper
        block
        className={`mb-4 flex w-full flex-col`}
        loaded={comments.length > 0}
      >
        <Skeleton.Group className="flex w-full grow flex-wrap gap-1">
          {[
            "w-32",
            "w-16",
            "w-24",
            "w-20",
            "w-18",
            "w-20",
            "w-18",
            "w-32",
            "w-16",
            "w-20",
            "w-36",
            "w-28",
            "w-24",
          ].map((width, index) => (
            <Skeleton
              key={index}
              type="inline"
              className={`h-8 ${width} rounded-full`}
            ></Skeleton>
          ))}
        </Skeleton.Group>
        <Skeleton.Content className="w-full shrink" unmount>
          <CommentTagScrollContainer>
            {comments.map((content, index) => (
              <PillButton
                key={content}
                size="small"
                onClick={() => onButtonClick(content)}
              >
                {content}
              </PillButton>
            ))}
          </CommentTagScrollContainer>
        </Skeleton.Content>
      </Skeleton.Wrapper>
    </div>
  );
};

export default CommentSuggestion;
