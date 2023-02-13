import { richTextObject } from "../notion/richText";
import TimeAgo from "javascript-time-ago";
import { GiPostStamp, GiDominoMask } from "react-icons/gi";
import ExternalLink from "../atoms/ExternalLink";
import Tooltip from "../atoms/Tooltip";
// English.
const getInitials = function (string) {
  var names = string.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};
const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

// Create formatter (English).
const CommentList = ({ comments, wording }) => {
  // const fetcher = (url, page) =>
  //   axios.get(url, { params: { page: page } }).then((res) => res.data);
  // const { data: counter } = useSWR(`/api/reaction?page=${page}`, fetcher, {revalidateOnMount: true});
  // const [counter, setCounter] = useState({});

  const timeAgo = new TimeAgo("en-US");
  const avatarColors = [
    "bg-blue-200 text-blue-800/70",
    "bg-purple-200 text-purple-800/70",
    "bg-green-200 text-green-800/70",
    "bg-red-200 text-red-800/70",
    "bg-cyan-200 text-cyan-800/70",
    "bg-pink-200 text-pink-800/70",
    "bg-yellow-200 text-yellow-800/70",
  ];
  return (
    <div className="grid grid-cols-1 gap-y-4 ">
      {comments && (
        <>
          {comments.length > 0 ? (
            comments.map((comment, i) => {
              const hasName = comment.name && comment.name.length > 0;
              const name = hasName ? comment.name[0].plain_text : "Anonymous";
              const avatarColor = hasName
                ? avatarColors[getHashOfString(name) % avatarColors.length]
                : "bg-gray-200 text-gray-800/70";
              return (
                <div
                  key={`comment-${i}`}
                  className="rounded-lg bg-gray-100 pl-3 pr-4 py-3 flex space-x-4"
                >
                  <span
                    className={`rounded-full w-8 h-8 text-sm flex items-center justify-center flex-shrink-0 ${avatarColor}`}
                  >
                    {hasName ? (
                      getInitials(name)
                    ) : (
                      <GiDominoMask className="text-base" />
                    )}
                  </span>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <h6 className="font-medium text-gray-800">
                        {hasName ? richTextObject(comment.name) : "Someone"}
                      </h6>
                      <span className="text-sm muted-text">
                        {timeAgo.format(new Date(comment.createdTime))}
                      </span>
                    </div>
                    <div>{richTextObject(comment.content)}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center flex flex-col items-center">
              <GiPostStamp className="text-slate-400 text-6xl" />
              <h5 className="text-lg font-medium text-gray-600 mt-2">
                No {wording.plural} yet.
              </h5>
              <p className="text-gray-800 mt-1">
                {`Why don't you `}
                <Tooltip content="A nostalgia trend of Yahoo 360 era"><ExternalLink href="https://vnexpress.net/boc-tem-van-hoa-nham-nhung-ton-tai-lau-nhat-tren-blog-1532146.html">{`"tem"`}</ExternalLink></Tooltip>
                {` this article?`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default CommentList;
