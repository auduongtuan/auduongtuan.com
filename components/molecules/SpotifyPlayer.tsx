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
        <div className="flex items-center gap-3">
          <CustomImage
            className={twMerge(
              `overflow-hidden rounded-full ${
                data.isPlaying && "animate-spin-slow"
              } shrink-0 grow-0`,
            )}
            width="48"
            height="48"
            src={data.albumImageUrl}
            alt={data.title}
          />
          <div className="flex shrink grow flex-col">
            <p className="muted-text _text-sm _text-secondary">
              {data.isPlaying ? "Now playing 🎵" : "Offline - Recently played"}
            </p>
            <p className="max-w-full text-base font-normal tracking-tight">
              {data.artist} <span className="text-secondary">-</span>{" "}
              <a href={data.songUrl} target="_blank" rel="noreferrer">
                {data.title}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <Skeleton.Wrapper loaded={false} className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" type="inline"></Skeleton>
          <div className="flex-1">
            <Skeleton
              className="h-4 w-[50%] max-w-[240px] rounded-full"
              type="inline"
            ></Skeleton>
            <Skeleton
              className="mt-2 h-4 w-[80%] max-w-[320px] rounded-full"
              type="inline"
            ></Skeleton>
          </div>
        </Skeleton.Wrapper>
      )}
    </>
  );
};

export default SpotifyPlayer;
