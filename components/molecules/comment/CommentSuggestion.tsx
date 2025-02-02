import PillButton from "@atoms/PillButton";
import Skeleton from "@atoms/Skeleton";
import Tooltip from "@atoms/Tooltip";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiAiGenerate2 } from "react-icons/ri";

const CommentSuggestion = ({
  onButtonClick,
  page,
}: {
  onButtonClick: (content: string) => void;
  page: string;
}) => {
  const [list, setList] = useState<string[]>([]);
  const [useEnglish, setUseEnglish] = useState(false);

  useEffect(() => {
    setList([]);
    const list = axios
      .get("/api/comment-suggestion", {
        params: {
          page: process.env.NEXT_PUBLIC_PRODUCTION_WEB_URL + page,
          language: useEnglish ? "english" : "vietnamese",
        },
      })
      .then((res) => {
        setList(
          (res.data as string[][])[Math.floor(Math.random() * res.data.length)],
        );
      });
  }, [useEnglish]);

  return (
    <div>
      <p className="muted-text mb-2 flex items-center gap-2">
        <Tooltip
          content={
            "This is AI-generated content. Powered by Gemini. Use with caution!"
          }
        >
          <RiAiGenerate2 className="hover:text-accent inline-block h-4 w-4" />
        </Tooltip>
        Suggestion{" "}
        <Tooltip content="Switch to English">
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
        loaded={list.length > 0}
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
        <Skeleton.Content className="w-full shrink">
          <div className="flex grow flex-wrap gap-1">
            {list.map((content, index) => (
              <PillButton
                key={content}
                size="small"
                onClick={() => onButtonClick(content)}
              >
                {content}
              </PillButton>
            ))}
          </div>
        </Skeleton.Content>
      </Skeleton.Wrapper>
    </div>
  );
};

export default CommentSuggestion;
