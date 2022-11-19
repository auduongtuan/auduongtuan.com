import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import Tooltip from "../atoms/Tooltip";
const ReactButton = ({ name, emoji, counter, page }) => {
  const [reacted, setReacted] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (counter && emoji in counter) {
      setReacted(counter[emoji].reacted);
      setQuantity(counter[emoji].quantity);
    }
  }, [counter, emoji]);
  const sendReaction = useCallback(
    (e) => {
      e.preventDefault();
      if (emoji) {
        // setLoading(true);
        if (reacted) {
          setQuantity(quantity - 1);
          setReacted(false);
        } else {
          setQuantity(quantity + 1);
          setReacted(true);
        }
        axios
          .post("/api/reaction", {
            react: emoji,
            page,
            type: reacted ? "REMOVE" : "ADD",
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [quantity, reacted, emoji, page]
  );
  return (
    <Tooltip content={reacted ? `Undo ${name}` : `${name}`}>
      <button
        className="border-2 px-4 py-2 border-gray-300 hover:border-blue-600 rounded-full inline-flex items-center justify-items-center space-x-2 hover:bg-white/40  transition-all ease-out duration-100 group"
        onClick={sendReaction}
      >
        <span className="block transition-all duration-100 scale-100 group-hover:scale-125 text-2xl ">
          {emoji}
        </span>
        <span
          className={`block text-sm ${
            reacted ? "font-bold text-blue-700" : ""
          }`}
        >
          {quantity}
        </span>
      </button>
    </Tooltip>
  );
};
const Reaction = ({ page }) => {
  const reactionList = {
    "💖": "Love",
    "😆": "Haha",
    "😮": "Wow",
    "💅": "Fabulous",
    "🤨": "Hmmm",
  };
  const fetcher = (url) =>
    axios.get(url, { params: { page: page } }).then((res) => res.data);

  const { data: counter } = useSWR("/api/reaction", fetcher);
  return (
    <div className="w-full flex flex-wrap flex-gap-x-3 flex-gap-y-2 items-center">
      {Object.keys(reactionList).map((emoji, i) => (
        <ReactButton
          key={`emoji-${i}`}
          name={reactionList[emoji]}
          emoji={emoji}
          page={page}
          counter={counter}
        ></ReactButton>
      ))}
    </div>
  );
};
export default Reaction;
