import Link from 'next/link'
import Image from "next/legacy/image";
import React from 'react';
import BrowserFrame from '../../atoms/Frame';
import Box, {EmojiBox, VideoBox} from '../../atoms/Box';
import Note from '../../atoms/Note';
import {Grid, Col} from "../../atoms/Grid";
import CustomImage, {CustomImageProps} from '../../atoms/CustomImage';
import CustomVideo, {CustomVideoProps} from '../../atoms/CustomVideo';
import Code from '../../atoms/Code';
import InlineLink from '../../atoms/InlineLink';
const ProjectComponents = (slug: string) => ({
    h2: ({children}:{children:React.ReactNode}) => (
      <h2 className='lg:relative'><span className='relative lg:sticky lg:top-3'>{children}</span></h2>
    ),
    img: ({ src, alt }:{src: string, alt: string}) => {
      const ext = src.split('.').pop();
      return (
          (ext == 'png' || ext == 'jpg') ? <CustomImage alt={alt} src={src} slug={slug} /> : ''
      );
    },
    a: ({href, children, ...rest}) => {
      return <InlineLink href={href} {...rest}>{children}</InlineLink>
    },
    Image: (props: CustomImageProps) => {
      return <CustomImage {...props} slug={slug} />;
    },
    Vimeo: ({id, ratio = 56.25}: {id: string | number, ratio: number}) => (
      <div className="vimeo" style={{ padding: `${ratio}% 0 0 0`, position: "relative"}}>
        <iframe title='Video' src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&sidedock=0`} style={{position: "absolute", top: 0, left:0, width: "100%", height: "100%"}} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>
      </div>
    ),
    Video: (props: CustomVideoProps) => <CustomVideo {...props} slug={slug} />,
    Figure: ({children, caption, ...rest}:{children:React.ReactNode, caption?:React.ReactNode}) => (
      <figure {...rest}>
        <div className='rounded-xl overflow-hidden translate-z-0 leading-[0]'>{children}</div>
        {caption && <figcaption className='mt-2 lg:mt-4 text-base'>{caption}</figcaption>}
      </figure>
    ),
    Note,
    FullWidth: ({children}:{children:React.ReactNode}) => {
      return (
        <div className='full'>{children}</div>
      );
    },
    ContentNode: ({children, className = ''}:{children:React.ReactNode, className: string}) => {
      return (
        <div className={`content-node ${className}`}>{children}</div>
      );
    },
    Box: Box,
    Grid: Grid,
    Col: Col,
    EmojiBox: EmojiBox,
    VideoBox: VideoBox,
    BrowserFrame: BrowserFrame,
    // code: Code,
    Persona: ({children, name = '', image = '', layout = 1, imageWidth, imageHeight }:{children:React.ReactNode, name: string, image: string | React.ReactNode, layout: 1|2, imageWidth?: number , imageHeight?: number}) => {
      let imageTag;
      if (typeof image == 'string' && (image.split('.').pop() == 'png' || image.split('.').pop() == 'jpg')) {
        if ( imageWidth && imageHeight) {
          imageTag = <CustomImage src={image} slug={slug} alt={name} width={imageWidth} height={imageHeight} layout="responsive" />;
        } else {
          imageTag = <CustomImage src={image} slug={slug} alt={name} layout="fill" />;
        }
      } else if (React.isValidElement(image)) {
        imageTag = image;
      }
      return (
        <div className={`shadow-sm bg-white p-4 h-full rounded-xl persona-${layout}`}>
          <div className={`${layout == 2 ? 'rounded-full overflow-hidden w-28 h-28 md:w-32 md:h-32 lg:w-32 lg:h-32 xl:w-40 xl:h-40 leading-0' : ''} image`}>{imageTag}</div>
          {name && <h3>{name}</h3>}
          {children}
        </div>
      );
    },
});
export default ProjectComponents;