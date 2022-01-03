import Link from 'next/link'
import Image from 'next/image'
import React from 'react';
import BrowserFrame from './BrowserFrame';
import Box, {EmojiBox, VideoBox} from './Box';
import {Grid, Col} from "./Grid";
import CustomImage from './CustomImage';

const ProjectComponents = (slug: string) => ({
    h2: ({children}:{children:React.ReactNode}) => (
      <h2 className='lg:relative'><span className='relative lg:absolute'>{children}</span></h2>
    ),
    img: ({ src, alt }:{src: string, alt: string}) => {
      const ext = src.split('.').pop();
      return (
          (ext == 'png' || ext == 'jpg') ? <CustomImage alt={alt} src={src} slug={slug} /> : ''
      );
    },
    Image: Image,
    Vimeo: ({id, ratio = 56.25}: {id: string | number, ratio: number}) => (
      <div className="vimeo" style={{ padding: `${ratio}% 0 0 0`, position: "relative"}}>
        <iframe title='Video' src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&sidedock=0`} style={{position: "absolute", top: 0, left:0, width: "100%", height: "100%"}} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
      </div>
    ),
    Video: ({poster, src, width, height}: {poster: string, src: string, width: string|number, height: string|number}) => {
      return <video className='w-full h-auto' poster={poster && poster} src={`/${slug}/${src}`} width={width ? width : undefined} height={height ? height: undefined} loop muted autoPlay playsInline preload="true"></video>
    },
    Figure: ({children, caption}:{children:React.ReactNode, caption:React.ReactNode}) => (
      <figure>
        <div className='rounded-xl overflow-hidden translate-z-0'>{children}</div>
      <figcaption className='mt-4 text-base'>{caption}</figcaption>
      </figure>
    ),
    FullWidth: ({children}:{children:React.ReactNode}) => {
      return (
        <div className='full'>{children}</div>
      );
    },
    Box: Box,
    Grid: Grid,
    Col: Col,
    EmojiBox: EmojiBox,
    VideoBox: VideoBox,
    BrowserFrame: BrowserFrame,
    Persona: ({children, name = '', image = '', layout = 1 }:{children:React.ReactNode, name: string, image: string | React.ReactNode, layout: 1|2}) => {
      let imageTag;
      if (typeof image == 'string' && (image.split('.').pop() == 'png' || image.split('.').pop() == 'jpg')) {
        imageTag = <CustomImage slug={slug} alt={name} src={image} />;
      } else if (React.isValidElement(image)) {
        imageTag = image;
      }
      return (
        <div className={`shadow-sm bg-white p-4 h-full rounded-xl persona-${layout}`}>
          <div className={`${layout == 2 ? 'rounded-full overflow-hidden w-40 h-40 leading-0' : ''} image`}>{imageTag}</div>
          {name && <h3>{name}</h3>}
          {children}
        </div>
      );
    },
});
export default ProjectComponents;