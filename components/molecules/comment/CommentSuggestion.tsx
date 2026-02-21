import FadeScrollableContainer from "@atoms/FadeScrollableContainer";
import PillButton from "@atoms/PillButton";
import Skeleton from "@atoms/Skeleton";
import Tooltip from "@atoms/Tooltip";
import { useResizeObserver } from "@hooks/useResizeObserver";
import { type CommentSuggestion } from "@lib/commentSuggestion";
import { useEffect, useRef, useState } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import useSWR from "swr";

function getComments(
  suggestion: CommentSuggestion,
  language: "vietnamese" | "english",
) {
  const sets = suggestion[language] as string[][];
  return sets[Math.floor(Math.random() * sets.length)] || [];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CommentTagScrollContainer = ({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"div">) => {
  const { width, ref } = useResizeObserver<HTMLDivElement>();
  const tagContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!tagContainerRef.current) return;
    console.log(ref.current.clientWidth);
    const tagContainer = tagContainerRef.current as HTMLDivElement;
    tagContainer.style.maxWidth = "200%";
    let largestRowWidth = 0;
    let currentRowWidth = 0;
    let currentRowTop = 0;
    let isFirstChild = true;
    const tagContainerStyles = window.getComputedStyle(tagContainer);
    const gap = parseFloat(tagContainerStyles.gap) || 0;
    Array.from(tagContainer.childNodes).forEach((child, index) => {
      const element = child as HTMLElement;
      const rect = element.getBoundingClientRect();
      if (isFirstChild) {
        currentRowTop = rect.top;
        currentRowWidth = rect.width;
        isFirstChild = false;
      } else {
        // If element is on a new row (different top position)
        if (Math.abs(rect.top - currentRowTop) > 1) {
          largestRowWidth = Math.max(largestRowWidth, currentRowWidth);
          currentRowWidth = rect.width;
          currentRowTop = rect.top;
        } else {
          // Same row, add to current row width including gap
          currentRowWidth += rect.width + gap;
        }
      }
    });

    // Don't forget the last row
    largestRowWidth = Math.max(largestRowWidth, currentRowWidth);
    if (largestRowWidth) tagContainer.style.maxWidth = `${largestRowWidth}px`;
  }, [width, tagContainerRef, children]);
  return (
    <FadeScrollableContainer ref={ref} {...rest}>
      <div
        ref={tagContainerRef}
        className="inline-flex flex-wrap gap-1 w-max max-w-[200%] shrink-0 grow"
      >
        {children}
      </div>
    </FadeScrollableContainer>
  );
};

const CommentSuggestion = ({
  onButtonClick,
  page,
}: {
  onButtonClick: (content: string) => void;
  page: string;
}) => {
  const { data: suggestion } = useSWR<CommentSuggestion>(
    `/api/comment-suggestion?page=${encodeURIComponent(page)}`,
    fetcher,
  );

  const [useEnglish, setUseEnglish] = useState(false);
  const comments = suggestion
    ? getComments(suggestion, useEnglish ? "english" : "vietnamese")
    : [];

  return (
    <div>
      <p className="flex items-center gap-2 mb-2 muted-text">
        <Tooltip
          content={"AI-generated content powered by Gemini. Use cautiously."}
        >
          <RiAiGenerate2 className="inline-block w-4 h-4 hover:text-accent" />
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
        <Skeleton.Group className="flex flex-wrap gap-1 w-full grow">
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
        <Skeleton.Content className="w-full shrink">
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
