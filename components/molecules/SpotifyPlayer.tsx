import CustomImage from "@atoms/CustomImage";
import Skeleton from "@atoms/Skeleton";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";

const VinylFrame = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_2567_1528"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="201"
      height="201"
    >
      <path
        d="M29.2893 29.2893C68.3417 -9.76313 131.659 -9.76308 170.711 29.2893C209.764 68.3418 209.764 131.659 170.711 170.711C131.659 209.764 68.3418 209.764 29.2893 170.711C-9.76307 131.659 -9.76313 68.3417 29.2893 29.2893ZM100 55.6135C75.5252 55.6135 55.6145 75.5242 55.6145 99.9993C55.6145 124.474 75.5252 144.385 100 144.385C124.475 144.385 144.386 124.474 144.386 99.9993C144.386 75.5242 124.475 55.6135 100 55.6135Z"
        fill="black"
      />
    </mask>
    <g mask="url(#mask0_2567_1528)">
      <path
        d="M170.711 170.711C209.764 131.659 209.764 68.3421 170.711 29.2896C131.659 -9.76284 68.3421 -9.76284 29.2896 29.2896C-9.76286 68.3421 -9.76287 131.659 29.2896 170.711C68.3421 209.764 131.659 209.764 170.711 170.711Z"
        fill="#090909"
      />
      <path
        opacity="0.7"
        d="M100 192.28C49.118 192.28 7.71899 150.881 7.71899 99.9992C7.71899 49.117 49.118 7.71802 100 7.71802C150.882 7.71802 192.281 49.117 192.281 99.9992C192.281 150.881 150.882 192.28 100 192.28Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 187.678C51.6542 187.678 12.3215 148.345 12.3215 99.9992C12.3215 51.6532 51.6542 12.3206 100 12.3206C148.346 12.3206 187.679 51.6532 187.679 99.9992C187.679 148.345 148.346 187.678 100 187.678Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 183.305C54.0659 183.305 16.6941 145.934 16.6941 99.9992C16.6941 54.0648 54.0659 16.693 100 16.693C145.935 16.693 183.307 54.0648 183.307 99.9992C183.307 145.934 145.935 183.305 100 183.305Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 179.149C56.3575 179.149 20.8459 143.642 20.8459 99.9946C20.8459 56.347 56.3527 20.8402 100 20.8402C143.648 20.8402 179.155 56.347 179.155 99.9946C179.155 143.642 143.648 179.149 100 179.149Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 175.203C58.5293 175.203 24.7964 141.465 24.7964 99.9992C24.7964 58.5331 58.5341 24.7954 100 24.7954C141.466 24.7954 175.204 58.5331 175.204 99.9992C175.204 141.465 141.466 175.203 100 175.203Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 171.454C60.6005 171.454 28.5457 139.399 28.5457 99.9992C28.5457 60.5994 60.6005 28.5446 100 28.5446C139.4 28.5446 171.455 60.5994 171.455 99.9992C171.455 139.399 139.4 171.454 100 171.454Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 167.892C62.566 167.892 32.1077 137.433 32.1077 99.9993C32.1077 62.5652 62.566 32.1068 100 32.1068C137.434 32.1068 167.893 62.5652 167.893 99.9993C167.893 137.433 137.434 167.892 100 167.892Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 164.507C64.4312 164.507 35.4927 135.568 35.4927 99.9993C35.4927 64.4301 64.4312 35.4916 100 35.4916C135.569 35.4916 164.508 64.4301 164.508 99.9993C164.508 135.568 135.569 164.507 100 164.507Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 161.29C66.2052 161.29 38.7097 133.795 38.7097 99.9993C38.7097 66.2041 66.2052 38.7086 100 38.7086C133.796 38.7086 161.291 66.2041 161.291 99.9993C161.291 133.795 133.796 161.29 100 161.29Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M100 158.231C67.888 158.231 41.7637 132.107 41.7637 99.9994C41.7637 67.8917 67.888 41.7675 100 41.7675C132.113 41.7675 158.237 67.8917 158.237 99.9994C158.237 132.107 132.113 158.231 100 158.231Z"
        stroke="#090909"
        strokeWidth="1.014"
        strokeMiterlimit="10"
      />
      <g opacity="0.7">
        <path
          d="M100 197.123C46.4476 197.123 2.87671 153.552 2.87671 99.9992C2.87671 46.4466 46.4476 2.87573 100 2.87573C153.553 2.87573 197.124 46.4466 197.124 99.9992C197.124 153.552 153.553 197.123 100 197.123Z"
          stroke="#161515"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 8.84473C150.264 8.84473 191.155 49.7355 191.155 99.9993C191.155 150.263 150.264 191.154 100 191.154C49.7365 191.154 8.8457 150.258 8.8457 99.9993C8.8457 49.7403 49.7365 8.84473 100 8.84473Z"
          stroke="#181717"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 14.8137C146.97 14.8137 185.181 53.0245 185.181 99.9946C185.181 146.965 146.97 185.175 100 185.175C53.0301 185.175 14.8193 146.965 14.8193 99.9946C14.8193 53.0245 53.0301 14.8137 100 14.8137Z"
          stroke="#191818"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 20.7875C143.677 20.7875 179.212 56.323 179.212 99.9994C179.212 143.676 143.677 179.211 100 179.211C56.3239 179.211 20.7883 143.676 20.7883 99.9994C20.7883 56.323 56.3239 20.7875 100 20.7875Z"
          stroke="#1B1A1A"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 26.7563C140.388 26.7563 173.243 59.6119 173.243 99.9993C173.243 140.387 140.388 173.242 100 173.242C59.6128 173.242 26.7573 140.387 26.7573 99.9993C26.7573 59.6119 59.6128 26.7563 100 26.7563Z"
          stroke="#1C1B1B"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 32.7252C137.094 32.7252 167.27 62.9007 167.27 99.9944C167.27 137.088 137.094 167.264 100 167.264C62.9067 167.264 32.7312 137.088 32.7312 99.9944C32.7312 62.9007 62.9067 32.7252 100 32.7252Z"
          stroke="#1E1D1D"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 38.699C133.8 38.699 161.301 66.1992 161.301 99.9992C161.301 133.799 133.8 161.3 100 161.3C66.2005 161.3 38.7002 133.799 38.7002 99.9992C38.7002 66.1992 66.2005 38.699 100 38.699Z"
          stroke="#1F1E1E"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
        <path
          d="M100 155.331C69.4892 155.331 44.6689 130.51 44.6689 99.9993C44.6689 69.4882 69.4892 44.668 100 44.668C130.511 44.668 155.332 69.4882 155.332 99.9993C155.332 130.51 130.511 155.331 100 155.331Z"
          stroke="#212020"
          strokeWidth="1.014"
          strokeMiterlimit="10"
        />
      </g>
      <g opacity="0.15">
        <path
          d="M-14.3059 108.102L102.398 95.6938L-20.3372 138.152L-14.3059 108.102Z"
          fill="white"
        />
      </g>
      <g opacity="0.15">
        <path
          d="M224.226 87.6347L107.355 94.2413L230.723 65.7726L224.226 87.6347Z"
          fill="white"
        />
      </g>
      <g opacity="0.25">
        <path
          d="M0.757812 165.221L77.9465 116.923L18.9763 186.048L0.757812 165.221Z"
          fill="white"
        />
      </g>
      <g opacity="0.25">
        <path
          d="M197.805 31.3109L120.616 79.6138L179.586 10.4891L197.805 31.3109Z"
          fill="white"
        />
      </g>
    </g>
    <path
      d="M100 101.927C98.936 101.927 98.073 101.064 98.073 99.9993C98.073 98.935 98.936 98.072 100 98.072C101.065 98.072 101.928 98.935 101.928 99.9993C101.928 101.064 101.065 101.927 100 101.927Z"
      fill="#090909"
    />
  </svg>
);

const VINYL_SIZE = 72;
const COVER_SIZE = VINYL_SIZE / 2;

const SpotifyPlayer = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/spotify", fetcher);
  return (
    <>
      {data ? (
        <div className="flex items-center gap-3">
          <div
            className={twMerge(
              `relative shrink-0 grow-0`,
              data.isPlaying && "animate-spin-slow",
            )}
            style={{ width: VINYL_SIZE, height: VINYL_SIZE }}
          >
            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                width: COVER_SIZE,
                height: COVER_SIZE,
                top: (VINYL_SIZE - COVER_SIZE) / 2,
                left: (VINYL_SIZE - COVER_SIZE) / 2,
              }}
            >
              <CustomImage
                className="rounded-full overflow-hidden"
                width={String(COVER_SIZE)}
                height={String(COVER_SIZE)}
                src={data.albumImageUrl}
                alt={data.title}
              />
            </div>
            <VinylFrame />
          </div>
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
