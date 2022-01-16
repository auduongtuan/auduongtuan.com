import React, {useEffect, useState, useCallback} from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from 'react-intersection-observer';
import BrowserFrame from "../atoms/Frame";
import CustomImage from "../atoms/CustomImage";
import ExternalLink from "../atoms/ExternalLink";
import {PhotoFrame} from "../atoms/Frame";
export default function AboutHeader() {
  const appContext = useAppContext();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: '-10px'
  });
  useEffect(() => {
    appContext && appContext.setHeaderInView && appContext.setHeaderInView(inView)    
    // console.log(entry);
  }, [inView, appContext]);
  const images = ['tuan.jpg', 'tuan_haha.jpg'];
  const [image, setImage] = useState(0);
 
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-8">
           <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">Xin chào!</h1>
          <div className="col-span-12 md:col-span-8 self-end">
           
            <p className="font-display big-text opacity-0 animation-delay-200 animate-slide-in-fast">
              I&apos;m Tuan - a software designer / design technologist based in Ho Chi Minh City. I currenly spend my days working on Design System at <ExternalLink>Aperia  ↗</ExternalLink> 
            </p>
     
          </div>
          <div className="col-span-12 md:col-span-4 md:row-start-1 md:col-start-9 md:row-span-2" onMouseOver={() => setImage(1)} onMouseLeave={() => setImage(0)}>
            <PhotoFrame name={images[image]} inverted className="opacity-0 animate-slide-in-fast animation-delay-400">
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
