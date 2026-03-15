import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@lib/utils/cn";
import Skeleton from "./Skeleton";
import SmartDarkSvg from "./SmartDarkSvg";

export interface CustomImageProps extends Omit<ImageProps, "alt"> {
  src: string;
  slug?: string;
  alt?: string;
  svgCode?: string;
  autoDarkSvg?: boolean;
}

function isSvgSource(src: string): boolean {
  const [path] = src.split("?");
  return path.toLowerCase().endsWith(".svg");
}

const CustomImage = ({
  src,
  alt,
  slug,
  svgCode,
  autoDarkSvg = true,
  width = undefined,
  height = undefined,
  className,
  ...rest
}: CustomImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const resolvedSrc = useMemo(() => {
    return slug ? `/uploads/${slug}/${src}` : src;
  }, [slug, src]);

  const isSvg = Boolean(svgCode) || isSvgSource(resolvedSrc);

  return (
    <Skeleton.Wrapper
      className={cn("overflow-hidden rounded-md", className)}
      loaded={isLoaded}
      data-image
    >
      <Skeleton type="image" />
      <Skeleton.Content>
        {isSvg ? (
          <SmartDarkSvg
            src={resolvedSrc}
            svgCode={svgCode}
            autoDark={autoDarkSvg}
            alt={alt ? alt : "Image of Tuan Website"}
            width={width}
            height={height}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <Image
            src={resolvedSrc}
            alt={alt ? alt : "Image of Tuan Website"}
            quality={100}
            width={width}
            height={height}
            priority={true}
            onLoad={() => setIsLoaded(true)}
            {...rest}
          />
        )}
      </Skeleton.Content>
    </Skeleton.Wrapper>
  );
};

export default CustomImage;
