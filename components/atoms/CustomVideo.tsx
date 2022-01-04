export interface CustomVideoProps {
  poster?: string;
  src: string;
  width?: string|number;
  height?: string|number;
  slug: string;
  autoPlay?: boolean;
  loop?: boolean;
}
const CustomVideo = ({poster, src, width, height, slug, autoPlay = true, loop = true}: CustomVideoProps) => {
  // return <video className='w-full h-auto' poster={poster && poster} src={require(`../../public/uploads/${slug}/${src}`)} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
  return <video className='w-full h-auto' poster={poster && poster} src={`/uploads/${slug}/${src}`} width={width ? width : undefined} height={height ? height: undefined} loop={loop} muted={autoPlay} autoPlay={autoPlay} playsInline={autoPlay} preload="true"></video>
};
export default CustomVideo;