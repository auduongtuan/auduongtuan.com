import FadeScrollableContainer from "@atoms/FadeScrollableContainer";
import PillButton from "@atoms/PillButton";
import Skeleton from "@atoms/Skeleton";
import Tooltip from "@atoms/Tooltip";
import { useEffect, useState } from "react";
import { FiGlobe } from "react-icons/fi";

function shuffleArray(array: string[], num: number) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, num);
  return selected;
}
const vnPosList = ["Đỉnh 💯", "Xinh xỉu 😍", "Keo quá 🫦"];
const enPosList = ["Awesome 👍", "Love this 💯", "Beautiful 🫦"];
const vnNegList = ["Thường thôi", "Hơi xu"];
const enNegList = ["Not my type", "Meh"];

const CommentSuggestion = ({
  onButtonClick,
}: {
  onButtonClick: (content: string) => void;
}) => {
  const [list, setList] = useState<string[]>([]);
  const [useEnglish, setUseEnglish] = useState(false);

  // Shuffle array
  useEffect(() => {
    const posList = shuffleArray(useEnglish ? enPosList : vnPosList, 3);
    const negList = shuffleArray(useEnglish ? enNegList : vnNegList, 2);
    setList([...posList, ...negList]);
  }, [useEnglish]);

  return (
    <Skeleton.Wrapper
      block
      className={`flex w-full h-[36px] mb-4`}
      loaded={list.length > 0}
    >
      <Skeleton type="block" className="rounded-full"></Skeleton>
      <Skeleton.Content className="flex-shrink w-full">
        <div className="flex justify-stretch">
          <div className="mr-1.5 flex flex-grow-0 flex-shrink-0">
            <Tooltip content="Use English">
              <PillButton
                active={useEnglish}
                onClick={() => setUseEnglish(!useEnglish)}
              >
                <FiGlobe />
              </PillButton>
            </Tooltip>
          </div>
          <div className="flex-grow flex-shrink min-w-0">
            <FadeScrollableContainer background="#FFFFFF">
              <div className="flex flex-grow -mr-1.5">
                {list.map((content, index) => (
                  <PillButton
                    key={content}
                    className="mr-1.5"
                    onClick={() => onButtonClick(content)}
                  >
                    {content}
                  </PillButton>
                ))}
              </div>
            </FadeScrollableContainer>
          </div>
        </div>
      </Skeleton.Content>
    </Skeleton.Wrapper>
  );
};

export default CommentSuggestion;
