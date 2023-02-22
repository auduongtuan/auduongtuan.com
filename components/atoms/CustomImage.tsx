import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
export interface CustomImageProps extends Omit<ImageProps, 'alt'> {
  src: string;
  slug?: string;
  alt?: string;
}
const ImageSkeleton = () => {
  return (
    <span
      role="status"
      className="animate-pulse flex items-center justify-center absolute top-0 left-0 w-full h-full bg-gray-200"
    >
      <FiImage className="w-12 h-12 text-gray-400"></FiImage>
      {/* <span className="sr-only">Loading...</span> */}
    </span>
  );
};
const CustomImage = ({
  src,
  alt,
  slug,
  width = undefined,
  height = undefined,
  ...rest
}: CustomImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // if (width && height) {
  //   if (typeof width == 'string') width = parseInt(width);
  //   if (typeof height == 'string') height = parseInt(height);
  //   if (width > 1200) {
  //     height = height*1200/width;
  //     width = 1200;
  //   }
  // }
  return (
    <span
      className="relative"
    >
      {!isLoaded ? <ImageSkeleton /> : ""}
      <Image
        src={slug ? `/uploads/${slug}/${src}` : src}
        alt={alt ? alt : 'Image of Tuan Website'}
        // placeholder={src.split(".").pop() != "svg" ? "blur" : undefined}
        // blurDataURL={src.split(".").pop() != "svg" ? `https://auduongtuan.imgix.net/${slug}/${src}?w=80` : undefined}
        quality={100}
        width={width}
        height={height}
        // layout='fill'
        // objectFit="contain"
        priority={true}
        onLoadingComplete={() => setIsLoaded(true)}
        {...rest}
      />
    </span>
  );
};
export default CustomImage;
