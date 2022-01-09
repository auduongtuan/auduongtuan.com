import React from "react";
export interface CustomVideoProps {
  poster?: string;
  src: string;
  width?: string|number;
  height?: string|number;
  slug: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}
const CustomVideo = React.forwardRef<HTMLVideoElement, CustomVideoProps>(({poster, src, width, height, slug, autoPlay = true, loop = true, className = ''}, ref) => {
  // return <video className='w-full h-auto' poster={poster && poster} src={require(`../../public/uploads/${slug}/${src}`)} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
  return <video ref={ref} className={`w-full h-auto ${className}`} poster={poster && poster} src={`/uploads/${slug}/${src}`} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
});
CustomVideo.displayName = 'CustomVideo';
export default CustomVideo;