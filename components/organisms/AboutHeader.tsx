import React, {useEffect, useState, useCallback} from "react";
import { setHeaderInView } from "../../store/store";
import { useInView } from 'react-intersection-observer';
import BrowserFrame from "../atoms/Frame";
import CustomImage from "../atoms/CustomImage";
import ExternalLink from "../atoms/ExternalLink";
import Link from "next/link";
import {PhotoFrame} from "../atoms/Frame";
import { useDispatch, useSelector } from "react-redux";
import useHeaderInView from "../../hooks/useHeaderInView";
import Balancer from 'react-wrap-balancer';
export default function AboutHeader() {
  const { ref, inView } = useHeaderInView();
  const images = ['tuan.jpg', 'tuan_haha.jpg'];
  const [image, setImage] = useState(0);
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="content-container p-header">
        <div className="grid grid-cols-12 gap-x-8 gap-y-6 md:gap-y-8">
           <h1 className="col-span-12 md:col-span-8 lg:mr-14 opacity-0 animate-slide-in-fast">Xin chào!</h1>
          <div className="col-span-12 md:col-span-8 lg:mr-14 self-end">
            <Balancer>
            <p className="text-base md:text-2xl leading-normal md:leading-normal opacity-0 animation-delay-150 animate-fade-in-fast">
              I&apos;m Tuan - a hybrid software designer &amp; developer. Proudly having many skills that span across a spectrum of disciplines helps me to solve problems in creative, organized and programmatic ways.</p>
            <p className="mt-4 md:mt-8 text-base md:text-2xl leading-normal md:leading-normal opacity-0 animation-delay-200 animate-fade-in-fast">

            I have been self-studying design &amp; code since 2009. Then, received a BFA in design and am getting my 2nd bachelor&apos;s degree in tech. You can read more at <Link href="/blog/my-digital-journey" className="underline-link-dark">my digital journey</Link>.

            </p>
            <p className="mt-4 md:mt-8 text-base md:text-2xl leading-normal md:leading-normal opacity-0 animation-delay-200 animate-fade-in-fast">
            Currently, I am working at <ExternalLink href="https://baemin.vn" className="underline-link-dark">BAEMIN ↗</ExternalLink> focusing on Design System and DesignOps. 
            </p>
            </Balancer>
          </div>
          <div className="col-span-12 md:col-span-4 md:row-start-1 md:col-start-9 md:row-span-2 self-end opacity-0 animate-slide-in-fast animation-delay-450" onMouseOver={() => setImage(1)} onMouseLeave={() => setImage(0)}>
            <PhotoFrame name={images[image]} closeTooltipContent="Hide my face 😢" inverted>
            <div className="grid grid-cols-1 grid-rows-1">
              <div className="col-start-1 row-start-1">
              <CustomImage src={images[0]} slug="about" width="1256" height="1570" />
              </div>
              <div className={`col-start-1 row-start-1 transition-opacity duration-200 ${image == 1 ? 'opacity-100' : 'opacity-0'}`}>
              <CustomImage src={images[1]} slug="about" width="1256" height="1570" />
              </div>
            </div>
            </PhotoFrame>
          </div>
        </div>
      </div>
    </header>
  );
}
