import React from "react";
import CustomImage from "./CustomImage";
import Box from "./Box";

export interface PersonaProps extends React.ComponentPropsWithoutRef<"div"> {
  name: string;
  image?: string | React.ReactNode;
  layout?: 1 | 2;
  imageWidth?: number;
  imageHeight?: number;
  slug?: string;
}

const Persona = ({
  children,
  name = "",
  image = "",
  layout = 1,
  imageWidth,
  imageHeight,
  slug,
  ...rest
}: PersonaProps) => {
  let imageTag;
  if (
    typeof image == "string" &&
    (image.split(".").pop() == "png" || image.split(".").pop() == "jpg")
  ) {
    if (imageWidth && imageHeight) {
      imageTag = (
        <CustomImage
          src={image}
          slug={slug}
          alt={name}
          width={imageWidth}
          height={imageHeight}
        />
      );
    } else {
      imageTag = <CustomImage src={image} slug={slug} alt={name} fill />;
    }
  } else if (React.isValidElement(image)) {
    imageTag = image;
  }
  return (
    <Box className={`p-4 h-full persona-${layout}`} {...rest}>
      <div
        className={`${
          layout == 2
            ? "rounded-full overflow-hidden w-28 h-28 md:w-32 md:h-32 lg:w-32 lg:h-32 xl:w-40 xl:h-40 leading-0"
            : ""
        } image`}
      >
        {imageTag}
      </div>
      {name && <h3>{name}</h3>}
      {children}
    </Box>
  );
};

export default Persona;
