import { useCallback, useEffect, useState, useReducer } from "react";
import useSWR from "swr";
import axios from "axios";
import Tooltip from "../atoms/Tooltip";

function counterReducer(counter, action) {
  if (!counter) counter = {};
  switch (action.type) {
    case "react":
      return {
        ...counter,
        [action.emoji]: {
          reacted: true,
          quantity: counter[action.emoji].quantity + 1,
        },
      };
    case "undo":
      return {
        ...counter,
        [action.emoji]: {
          reacted: false,
          quantity: counter[action.emoji].quantity - 1,
        },
      };
    case "load":
      return action.data;
    default:
      throw new Error();
  }
}
const reactionList = {
  "💖": "Love",
  "😆": "Haha",
  "😮": "Wow",
  "💅": "Fabulous",
  "🤨": "Hmmm",
};

const ReactButton = ({ name, emoji, counter, dispatch, page }) => {

  const sendReaction = useCallback(
    (e) => {
      e.preventDefault();
      if (emoji) {
        // setLoading(true);
        if (counter[emoji].reacted) {
          dispatch({ type: "undo", emoji });
        } else {
          dispatch({ type: "react", emoji });
        }
        axios
          .post("/api/reaction", {
            react: emoji,
            page,
            type: counter[emoji].reacted ? "REMOVE" : "ADD",
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [counter, dispatch, emoji, page]
  );
  return (
    <Tooltip content={counter[emoji].reacted ? `Undo ${name}` : `${name}`}>
      <button
        className="flex-shrink-1 border-2 px-3 py-2 md:px-4 md:py-2 border-gray-300 hover:border-blue-600 rounded-full inline-flex items-center justify-items-center space-x-2 hover:bg-white/40  transition-all ease-out duration-100 group"
        onClick={sendReaction}
      >
        <span className="block transition-all duration-100 scale-100 group-hover:scale-125 text-base md:text-2xl ">
          {emoji}
        </span>
        <span
          className={`block text-sm ${
            counter[emoji].reacted ? "font-semibold text-blue-700" : "font-medium text-gray-500"
          }`}
        >
          {counter[emoji].quantity}
        </span>
      </button>
    </Tooltip>
  );
};

const Reaction = ({ page }) => {
  // const fetcher = (url, page) =>
  //   axios.get(url, { params: { page: page } }).then((res) => res.data);
  // const { data: counter } = useSWR(`/api/reaction?page=${page}`, fetcher, {revalidateOnMount: true});
  // const [counter, setCounter] = useState({});
  const [counter, dispatch] = useReducer(counterReducer, null);
  useEffect(() => {
    axios.get(`/api/reaction?page=${page}`).then((res) => {
      // setCounter(res.data);
      const defaultData = Object.keys(reactionList).reduce((acc, crr) => {
        acc[crr] = {
          reacted: false,
          quantity: 0
        };
        return acc;
      }, {});
      dispatch({ type: "load", data: {...defaultData, ...res.data} });
    });
  }, [dispatch, page]);
  return (
    <div className="w-full flex flex-gap-x-2 md:flex-gap-x-3 flex-gap-y-2 items-center h-[60px]">
      {counter ? Object.keys(reactionList).map((emoji, i) => (
        <ReactButton
          key={`emoji-${i}`}
          name={reactionList[emoji]}
          emoji={emoji}
          page={page}
          counter={counter}
          dispatch={dispatch}
        ></ReactButton>
      )): null}
    </div>
  );
};
export default Reaction;
