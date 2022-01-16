import Image, {ImageProps} from 'next/image'
export interface CustomImageProps extends ImageProps {
  src: string,
  slug: string
}
const CustomImage = ({src, alt, slug, width = undefined, height = undefined, ...rest}: CustomImageProps) => {
  // if (width && height) {
  //   if (typeof width == 'string') width = parseInt(width);
  //   if (typeof height == 'string') height = parseInt(height);
  //   if (width > 1200) {
  //     height = height*1200/width;
  //     width = 1200;
  //   }
  // }
  return (
    <Image
        src={`/uploads/${slug}/${src}`}
        alt={alt}
        placeholder={src.split(".").pop() != "svg" ? "blur" : undefined}
        blurDataURL={src.split(".").pop() != "svg" ? `https://auduongtuan.imgix.net/${slug}/${src}?w=80` : undefined}
        quality={100}
        width={width}
        height={height}
        // layout='fill'
        // objectFit="contain"
        {...rest}
      />
  )
}
export default CustomImage;