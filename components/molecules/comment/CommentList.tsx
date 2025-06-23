import { richTextObject } from "@notion/richText";
import TimeAgo from "javascript-time-ago";
import { GiPostStamp, GiDominoMask } from "react-icons/gi";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import Skeleton from "@atoms/Skeleton";
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
    <section>
      {comments ? (
        <>
          {comments.length > 0 && (
            <div>
              <h3 className="subheading mb-4">
                {comments.length}{" "}
                {comments.length == 1 ? "comment" : "comments"}
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                {comments.map((comment, i) => {
                  const hasName = comment.name && comment.name.length > 0;
                  const name = hasName
                    ? comment.name[0].plain_text
                    : "Anonymous";
                  const avatarColor = hasName
                    ? avatarColors[getHashOfString(name) % avatarColors.length]
                    : "bg-gray-300 text-primary/70";
                  return (
                    <div key={`comment-${i}`} className="flex space-x-3">
                      <span
                        className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${avatarColor}`}
                      >
                        {hasName ? (
                          getInitials(name)
                        ) : (
                          <GiDominoMask className="text-base" />
                        )}
                      </span>
                      <div className="w-full rounded-xl bg-gray-100 px-4 py-3">
                        <div className="flex justify-between">
                          <h6 className="text-primary font-medium">
                            {hasName ? richTextObject(comment.name) : "Someone"}
                          </h6>
                          <span className="muted-text text-sm">
                            {timeAgo.format(new Date(comment.createdTime))}
                          </span>
                        </div>
                        <div className="small-body-text text-primary">
                          {richTextObject(comment.content)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {comments.length == 0 && (
            <div
              className={`flex flex-col items-center py-3 text-center ${
                !comments ? "opacity-0" : "opacity-100"
              }`}
            >
              <GiPostStamp className="text-tertiary text-6xl" />
              <h5 className="subheading mt-4">No {wording.plural} yet.</h5>
              <p className="text-secondary mt-1 text-sm">
                {`Why don't you `}
                <Tooltip content="A nostalgia trend of Yahoo 360 era">
                  <InlineLink href="https://vnexpress.net/boc-tem-van-hoa-nham-nhung-ton-tai-lau-nhat-tren-blog-1532146.html">{`"tem"`}</InlineLink>
                </Tooltip>
                {` this article?`}
              </p>
            </div>
          )}
        </>
      ) : (
        <Skeleton.Wrapper
          block
          className="flex flex-col space-y-3 md:space-y-5"
        >
          <div className="flex space-x-3">
            <Skeleton
              type="inline"
              className={`mt-2 h-8 w-8 shrink-0 rounded-full`}
            />
            <Skeleton className="h-16 w-full rounded-xl" type="inline" />
          </div>
          <div className="flex space-x-3">
            <Skeleton
              type="inline"
              className={`h-8 w-8 shrink-0 rounded-full`}
            />
            <Skeleton className="h-16 w-full rounded-xl" type="inline" />
          </div>
        </Skeleton.Wrapper>
      )}
    </section>
  );
};
export default CommentList;
