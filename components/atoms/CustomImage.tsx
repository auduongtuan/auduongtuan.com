import Image, { ImageProps } from "next/legacy/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Skeleton from "./Skeleton";
export interface CustomImageProps extends Omit<ImageProps, "alt"> {
  src: string;
  slug?: string;
  alt?: string;
}
const CustomImage = ({
  src,
  alt,
  slug,
  width = undefined,
  height = undefined,
  className,
  ...rest
}: CustomImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <Skeleton.Wrapper
      className={twMerge("rounded-md overflow-hidden", className)}
      loaded={isLoaded}
      data-image
    >
      <Skeleton type="image" />
      <Skeleton.Content>
        <Image
          src={slug ? `/uploads/${slug}/${src}` : src}
          alt={alt ? alt : "Image of Tuan Website"}
          quality={100}
          width={width}
          height={height}
          priority={true}
          onLoad={() => setIsLoaded(true)}
          {...rest}
        />
      </Skeleton.Content>
    </Skeleton.Wrapper>
  );
};
export default CustomImage;
