import { useCallback, useEffect, useState, useReducer, Dispatch } from "react";
import useSWR from "swr";
import axios from "axios";
import Tooltip from "@atoms/Tooltip";
import Skeleton from "@atoms/Skeleton";
import { cn } from "@lib/utils/cn";
import { emojiBlast } from "emoji-blast";

type Emoji = string;
interface CounterValue {
  reacted: boolean;
  quantity: number;
}
type Counter = Record<string, CounterValue>;

type CounterAction =
  | {
      type: "react";
      payload: Emoji;
    }
  | {
      type: "undo";
      payload: Emoji;
    }
  | {
      type: "load";
      payload: Counter;
    };

function counterReducer(counter: Counter, action: CounterAction): Counter {
  if (!counter) counter = {};
  switch (action.type) {
    case "react":
      return {
        ...counter,
        [action.payload]: {
          reacted: true,
          quantity: counter[action.payload].quantity + 1,
        },
      };
    case "undo":
      return {
        ...counter,
        [action.payload]: {
          reacted: false,
          quantity: counter[action.payload].quantity - 1,
        },
      };
    case "load":
      return { ...action.payload };
    default:
      return counter;
  }
}

const reactionList = {
  "💖": "Love",
  "😆": "Haha",
  "😮": "Wow",
  "💅": "Slay",
  "🤨": "Eww",
};

export interface ReactButtonProps {
  name: string;
  emoji: string;
  counter: Counter;
  page: string;
  dispatch: Dispatch<CounterAction>;
  isLoading: boolean;
  size: "medium" | "small";
}
const ReactButton = ({
  name,
  emoji,
  counter,
  dispatch,
  isLoading,
  size,
  page,
}: ReactButtonProps) => {
  const sendReaction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (emoji) {
        // setLoading(true);
        if (counter[emoji].reacted) {
          dispatch({ type: "undo", payload: emoji });
        } else {
          dispatch({ type: "react", payload: emoji });
          emojiBlast({
            emojis: [emoji],
            physics: {
              gravity: -0.5,
              initialVelocities: {
                y: { max: 9, min: 6.7 },
                rotation: { max: -1, min: -2 },
              },
            },
            position: {
              x,
              y,
            },
          });
        }
        axios
          .post("/api/reaction", {
            react: emoji,
            page,
            type: counter[emoji].reacted ? "REMOVE" : "ADD",
          })
          .then((res) => {
            // console.log(res);
          })
          .catch((err) => {
            // console.error(err);
          });
      }
    },
    [counter, dispatch, emoji, page],
  );

  return (
    <Skeleton.Wrapper className="flex flex-shrink-1" loaded={!isLoading}>
      <Skeleton type="block" className="rounded-full"></Skeleton>
      <Skeleton.Content>
        <Tooltip
          content={
            emoji in counter && counter[emoji].reacted
              ? `Undo ${name}`
              : `${name}`
          }
        >
          <button
            className={cn(
              size == "medium"
                ? "gap-x-2 px-3 py-2 md:px-4 md:py-2"
                : "gap-x-1 px-2 py-[calc(var(--spacing)*0.5)] md:px-2.5 md:py-[calc(var(--spacing)*0.625)]",
              "hover:border-accent hover:bg-surface/40",
              "group inline-flex flex-shrink-1 items-center justify-center justify-items-center rounded-full border-2 border-gray-300 transition-all duration-100 ease-out",
            )}
            onClick={sendReaction}
          >
            <span
              className={cn(
                "block scale-100 text-base transition-all duration-100 group-hover:scale-125",
                size == "medium" ? "md:text-2xl" : "md:text-[0.75rem]",
              )}
            >
              {emoji}
            </span>
            <span
              className={cn(
                `block font-mono leading-1 tracking-tight`,
                size == "medium" ? "text-sm" : "text-xs",
                emoji in counter && counter[emoji].reacted
                  ? "font-semibold text-blue-700"
                  : "text-tertiary font-medium",
              )}
            >
              {emoji in counter ? counter[emoji].quantity : 0}
            </span>
          </button>
        </Tooltip>
      </Skeleton.Content>
    </Skeleton.Wrapper>
  );
};

const Reaction = ({
  page,
  size = "medium",
  className = "",
}: {
  page: string;
  size?: "medium" | "small";
  className?: string;
}) => {
  const [counter, dispatch] = useReducer(counterReducer, {});
  const { data, isLoading } = useSWR(
    ["/api/reaction", page],
    ([url, page]) =>
      axios.get(url, { params: { page: page } }).then((res) => res.data),
    { revalidateOnMount: true },
  );
  useEffect(() => {
    const defaultData = Object.keys(reactionList).reduce((acc, crr) => {
      acc[crr] = {
        reacted: false,
        quantity: 0,
      };
      return acc;
    }, {});
    dispatch({ type: "load", payload: { ...defaultData, ...data } });
  }, [data]);
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-x-2 gap-y-1.5 md:gap-x-2",
        className,
      )}
    >
      {Object.keys(reactionList).map((emoji, i) => (
        <ReactButton
          key={`emoji-${i}`}
          name={reactionList[emoji]}
          emoji={emoji}
          page={page}
          isLoading={isLoading}
          counter={counter}
          dispatch={dispatch}
          size={size}
        ></ReactButton>
      ))}
    </div>
  );
};

export default Reaction;
