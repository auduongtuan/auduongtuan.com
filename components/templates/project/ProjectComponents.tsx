import React from "react";
import BrowserFrame from "@atoms/Frame";
import Box, { EmojiBox, VideoBox } from "@atoms/Box";
import Note from "@atoms/Note";
import { Grid, Col } from "@atoms/Grid";
import CustomImage, { CustomImageProps } from "@atoms/CustomImage";
import CustomVideo, { CustomVideoProps } from "@atoms/CustomVideo";
import InlineLink from "@atoms/InlineLink";
import Persona, { PersonaProps } from "@atoms/Persona";

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
  Vimeo: ({ id, ratio = 56.25 }: { id: string | number; ratio: number }) => (
    <div
      className="vimeo"
      style={{ padding: `${ratio}% 0 0 0`, position: "relative" }}
    >
      <iframe
        title="Video"
        src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&sidedock=0`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
      ></iframe>
    </div>
  ),
  Video: (props: CustomVideoProps) => <CustomVideo {...props} slug={slug} />,
  Figure: ({
    children,
    caption,
    ...rest
  }: {
    children: React.ReactNode;
    caption?: React.ReactNode;
  }) => (
    <figure {...rest}>
      <div className="rounded-xl overflow-hidden translate-z-0 leading-[0]">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-base lg:mt-4">{caption}</figcaption>
      )}
    </figure>
  ),
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
