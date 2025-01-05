import Box, { EmojiBox, VideoBox } from "@atoms/Box";
import CustomImage, { CustomImageProps } from "@atoms/CustomImage";
import CustomVideo, { CustomVideoProps } from "@atoms/CustomVideo";
import Figure from "@atoms/Figure";
import BrowserFrame from "@atoms/Frame";
import { Col, Grid } from "@atoms/Grid";
import InlineLink from "@atoms/InlineLink";
import Note from "@atoms/Note";
import Persona, { PersonaProps } from "@atoms/Persona";
import Vimeo from "@atoms/Vimeo";
import React from "react";

const ProjectComponents = (slug: string) => ({
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="lg:relative">
      <span className="relative lg:sticky lg:top-3">{children}</span>
    </h2>
  ),
  img: ({ src, alt }) => {
    const ext = src && src.split(".").pop();
    return ext == "png" || ext == "jpg" ? (
      <CustomImage alt={alt} src={src} slug={slug} />
    ) : (
      ""
    );
  },
  a: ({ href, children, ...rest }) => {
    return (
      <InlineLink href={href} {...rest}>
        {children}
      </InlineLink>
    );
  },
  Image: (props: CustomImageProps) => {
    return <CustomImage {...props} slug={slug} />;
  },
  Vimeo,
  Video: (props: CustomVideoProps) => <CustomVideo {...props} slug={slug} />,
  Figure,
  Note,
  FullWidth: ({ children }: { children: React.ReactNode }) => {
    return <div className="full">{children}</div>;
  },
  ContentNode: ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className: string;
  }) => {
    return <div className={`content-node ${className}`}>{children}</div>;
  },
  Box: Box,
  Grid: Grid,
  Col: Col,
  EmojiBox: EmojiBox,
  VideoBox: VideoBox,
  BrowserFrame: BrowserFrame,
  // code: Code,
  Persona: (props: PersonaProps) => <Persona {...props} slug={slug} />,
});

export default ProjectComponents;
