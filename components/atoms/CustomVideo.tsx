import React, { useEffect, useRef, useImperativeHandle, useState } from "react";
import Skeleton from "./Skeleton";
import { twMerge } from "tailwind-merge";
export interface CustomVideoProps
  extends React.ComponentPropsWithoutRef<"video"> {
  poster?: string;
  src: string;
  width?: number;
  height?: number;
  slug?: string;
  className?: string;
  show?: boolean;
}

const CustomVideo = ({
  ref,
  poster,
  src,
  width,
  height,
  slug,
  autoPlay = true,
  loop = true,
  className = "",
  preload = "none",
  show = true,
  ...rest
}: CustomVideoProps & {
  ref?: React.RefObject<HTMLVideoElement>;
}) => {
  const innerRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  useImperativeHandle(ref, () => innerRef.current as HTMLVideoElement);
  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const lazyVideoObserver = new IntersectionObserver(function (
        entries,
        observer,
      ) {
        entries.forEach(function (video) {
          if (
            video.isIntersecting &&
            video.target instanceof HTMLVideoElement &&
            video.target.dataset.src &&
            show
          ) {
            video.target.src = video.target.dataset.src;
            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
            video.target.onloadeddata = () => {
              setLoaded(true);
            };
          }
        });
      });
      // console.log(innerRef);
      if (innerRef.current instanceof HTMLVideoElement)
        lazyVideoObserver.observe(innerRef.current);
      return () => lazyVideoObserver.disconnect();
    }
  }, [ref, show]);
  // return <video className='w-full h-auto' poster={poster && poster} src={require(`../../public/uploads/${slug}/${src}`)} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
  return (
    <Skeleton.Wrapper
      loaded={loaded}
      className="overflow-hidden rounded-md"
      block
      data-video
    >
      <Skeleton type="video"></Skeleton>
      <Skeleton.Content>
        <div
          className="relative h-0 w-full"
          style={
            width && height ? { paddingTop: `${(height / width) * 100}%` } : {}
          }
        >
          <video
            ref={innerRef}
            className={twMerge(
              `absolute top-0 left-0 h-full w-full`,
              className,
            )}
            poster={poster && `/uploads/${slug}/${poster}`}
            data-src={slug ? `/uploads/${slug}/${src}` : src}
            width={width ? width : undefined}
            height={height ? height : undefined}
            loop={loop}
            muted={autoPlay}
            autoPlay={autoPlay}
            playsInline={autoPlay}
            preload={preload ? "true" : "false"}
            {...rest}
          ></video>
        </div>
      </Skeleton.Content>
    </Skeleton.Wrapper>
  );
};
CustomVideo.displayName = "CustomVideo";
export default CustomVideo;
