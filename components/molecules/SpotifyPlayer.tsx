import CustomImage from "@atoms/CustomImage";
import Skeleton from "@atoms/Skeleton";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";

const SpotifyPlayer = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/spotify", fetcher);
  return (
    <>
      {data ? (
        <div className="flex items-center flex-gap-3">
          <CustomImage
            className={twMerge(
              `rounded-full overflow-hidden ${
                data.isPlaying && "animate-spin-slow"
              } grow-0 shrink-0`
            )}
            width="48"
            height="48"
            src={data.albumImageUrl}
            alt={data.title}
          />
          <div className="flex flex-col grow shrink">
            <p className="text-sm text-secondary">
              {data.isPlaying ? "Now playing 🎵" : "Offline - Recently played"}
            </p>
            <p className="max-w-full font-mono text-base font-medium tracking-tight">
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
          className="flex items-center flex-gap-3"
        >
          <Skeleton className="w-12 h-12 rounded-full" type="inline"></Skeleton>
          <div className="flex-1">
            <Skeleton
              className="w-[50%] max-w-[240px] h-4 rounded-full"
              type="inline"
            ></Skeleton>
            <Skeleton
              className="w-[80%] max-w-[320px] h-4 rounded-full mt-2"
              type="inline"
            ></Skeleton>
          </div>
        </Skeleton.Wrapper>
      )}
    </>
  );
};

export default SpotifyPlayer;
