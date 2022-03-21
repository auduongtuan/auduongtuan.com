import React, {useEffect, useRef} from "react";
import Button from "../atoms/Button";
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
import { useWindowSize } from "rooks";
import CustomVideo from "../atoms/CustomVideo";
import ExternalLink from "../atoms/ExternalLink";
import Headline from "../atoms/Headline";
import Link from "next/link";
import { PhotoFrame } from "../atoms/Frame";

interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  link?: string;
  gif?: HTMLElement|null;
  external?: boolean;
}
const GifText = ({children, gif, link, external = false, ...rest}: GifTextProps) => {
  const showGif = () => {
    // console.log(gif);
    gif?.classList.add('animate-slide-in-fast');
  }
  const hideGif = () => {
    // console.log(gif);
    gif?.classList.remove('animate-slide-in-fast');
  }
  
  const className = "underline decoration-2 underline-offset-4 transition-all duration-200 decoration-gray-600 hover:decoration-transparent inline-block -mx-2 px-2 py-1 rounded-xl hover:bg-white/5";
  const span = <a className={className} onMouseOver={showGif} onMouseLeave={hideGif} {...rest}>{children}</a>;
  if (link) {
    if(external) {
      return <ExternalLink href={link} className={className} onMouseOver={showGif} onMouseLeave={hideGif} {...rest}>{children}</ExternalLink>
    }
    else {
      return <Link href={link}>{span}</Link>;
    }
  } else {
    return span;
  }
}
export default function Header() {
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
  const gif1 = useRef<HTMLDivElement>(null);
  const gif2 = useRef<HTMLDivElement>(null);
  const gif3 = useRef<HTMLDivElement>(null);
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-8 lg:max-w-[50rem] z-4">
            <Headline />
            <p className="_font-display text-xl md:text-2xl mt-6 lg:mt-9 _tracking-tight opacity-0 animate-slide-in-fast animation-delay-200">I am a <GifText gif={gif1?.current}>designer</GifText> x <GifText gif={gif2?.current}>developer</GifText> hybrid (maybe a  <GifText link="https://designtechnologist.club/book/who-is-a-design-technologist/" title="Read more about this term" gif={gif3?.current} external>design technologist</GifText>?). Everyday I try to make good products with the human at the center</p>
            <Button href="/about" className="mt-10 opacity-0 animate-slide-in-fast animation-delay-300" colorful arrow>
              Get to know me
            </Button>
          </div>
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-4 relative z-30 pointer-events-none md:block">
            <PhotoFrame ref={gif1} className="absolute md:top-0 opacity-0" name="lam-dau-tram-ho.gif" inverted><CustomVideo className="w-full h-auto " slug="gif" src="designer.mp4" width={480} height={264} /></PhotoFrame>
            <PhotoFrame ref={gif2} className="absolute md:bottom-0 opacity-0" name="muon-bung-chay.gif" inverted><CustomVideo className="w-full h-auto" slug="gif" src="codes.mp4" width={480} height={270} /></PhotoFrame>
            <PhotoFrame ref={gif3} className="absolute md:-bottom-8 opacity-0" name="unicorn-designer.gif" inverted><CustomVideo className="w-full h-auto" slug="gif" src="unicorn.mp4" width={480} height={480} /></PhotoFrame>
          </div>
        </div>
      </div>
    </header>
  );
}
