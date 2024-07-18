import CustomImage from "@atoms/CustomImage";
import Skeleton from "@atoms/Skeleton";
import useSWR from "swr";

const SpotifyPlayer = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/spotify", fetcher);
  return (
    <>
      {data ? (
        <div className="flex items-center flex-gap-3">
          <CustomImage
            className={`rounded-full overflow-hidden ${
              data.isPlaying && "animate-spin-slow"
            } flex-grow-0`}
            width="48"
            height="48"
            src={data.albumImageUrl}
            alt={data.title}
          />
          <div className="flex-1">
            <p className="text-sm text-secondary">
              {data.isPlaying ? "Now playing 🎵" : "Offline - Recently played"}
            </p>
            <p className="text-base font-medium font-display">
              {data.artist} <span className="text-secondary">-</span>{" "}
              <a href={data.songUrl} target="_blank" rel="noreferrer">
                {data.title}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <Skeleton.Wrapper
          loaded={false}
          className="flex items-center flex-gap-4"
        >
          <Skeleton className="w-16 h-16 rounded-full" type="inline"></Skeleton>
          <div className="flex-1">
            <Skeleton
              className="w-[80%] h-4 rounded-full"
              type="inline"
            ></Skeleton>
            <Skeleton
              className="w-[50%] h-4 rounded-full mt-2"
              type="inline"
            ></Skeleton>
          </div>
        </Skeleton.Wrapper>
      )}
    </>
  );
};

export default SpotifyPlayer;
