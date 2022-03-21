import React, { useEffect, useRef, useImperativeHandle } from "react";
export interface CustomVideoProps {
  poster?: string;
  src: string;
  width?: number;
  height?: number;
  slug: string;
  autoPlay?: boolean;
  preload?: boolean;
  loop?: boolean;
  className?: string;
  show?: boolean;
}

const CustomVideo = React.forwardRef<HTMLVideoElement, CustomVideoProps>(({poster, src, width, height, slug, autoPlay = true, loop = true, className = '', preload = false, show = true}, ref) => {
  const innerRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLVideoElement);
  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(video) {
          console.log(video);
          if (video.isIntersecting && video.target instanceof HTMLVideoElement && video.target.dataset.src && show) {
            // console.log(video.target);
            // for (const source in video.target.children) {
            //   const videoSource = video.target.children[source] as HTMLVideoElement;
            //   if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
            //     videoSource.src = videoSource.dataset.src;
            //   }
            // }
            video.target.src = video.target.dataset.src;
            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });
      // console.log(innerRef);
      if (innerRef.current instanceof HTMLVideoElement) lazyVideoObserver.observe(innerRef.current);
    }
  }, [ref, show]);
  // return <video className='w-full h-auto' poster={poster && poster} src={require(`../../public/uploads/${slug}/${src}`)} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
  return (

      <video ref={innerRef} className={`w-full h-auto ${className}`} poster={poster && poster} data-src={`/uploads/${slug}/${src}`} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload={preload ? "true" : "false"}></video>
  );
});
CustomVideo.displayName = 'CustomVideo';
export default CustomVideo;