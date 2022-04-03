import React, {useEffect, useRef, useState} from "react";
import Button from "../atoms/Button";
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
import CustomVideo from "../atoms/CustomVideo";
import ExternalLink from "../atoms/ExternalLink";
import Headline from "../atoms/Headline";
import Link from "next/link";
import { PhotoFrame } from "../atoms/Frame";

interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  link?: string;
  // gif?: HTMLElement|null;
  gifs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  gifIndex: number;
  external?: boolean;
  setActiveGif?: Function;
}
const GifText = ({children, gifs, gifIndex, link, external = false, setActiveGif, ...rest}: GifTextProps) => {
  const showGif = () => {
    // console.log(gif);
    gifs.current[gifIndex]?.classList.add('animate-slide-in-fast');
    if(setActiveGif) setActiveGif(gifIndex);
  }
  const hideGif = () => {
    // console.log(gif);
    gifs.current[gifIndex]?.classList.remove('animate-slide-in-fast');
    if(setActiveGif) setActiveGif(null);
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
  const gifs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeGif, setActiveGif] = useState<number | null>(null);
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-8 lg:max-w-[50rem] z-4">
            <Headline />
            <p className="_font-display text-xl md:text-2xl mt-6 lg:mt-9 _tracking-tight opacity-0 animate-slide-in-fast animation-delay-200">I am a <GifText gifs={gifs} gifIndex={0} setActiveGif={setActiveGif}>designer</GifText> x <GifText gifs={gifs} gifIndex={1} setActiveGif={setActiveGif}>developer</GifText> hybrid (maybe a  <GifText link="https://designtechnologist.club/book/who-is-a-design-technologist/" title="Read more about this term" gifs={gifs} gifIndex={2} setActiveGif={setActiveGif} external>design technologist</GifText>?). Everyday I try to make good products with the human at the center.</p>
            <Button href="/about" className="mt-10 opacity-0 animate-slide-in-fast animation-delay-300" colorful arrow>
              Get to know me
            </Button>
          </div>
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-4 relative z-30 pointer-events-none md:block">
            <PhotoFrame ref={el => gifs.current[0] = el} className="absolute md:top-0 opacity-0" name="lam-dau-tram-ho.gif" inverted><CustomVideo className="w-full h-auto" slug="gif" src="designer.mp4" width={480} height={264} show={activeGif == 0} /></PhotoFrame>
            <PhotoFrame ref={el => gifs.current[1] = el} className="absolute md:bottom-0 opacity-0" name="muon-bung-chay.gif" inverted><CustomVideo className="w-full h-auto" slug="gif" src="codes.mp4" width={480} height={270} show={activeGif == 1} /></PhotoFrame>
            <PhotoFrame ref={el => gifs.current[2] = el} className="absolute md:-bottom-8 opacity-0" name="unicorn-designer.gif" inverted><CustomVideo className="w-full h-auto" slug="gif" src="unicorn.mp4" width={480} height={480} show={activeGif == 2} /></PhotoFrame>
          </div>
        </div>
      </div>
    </header>
  );
}
