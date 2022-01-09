import React, {useEffect, useRef} from "react";
import Button from "../atoms/Button";
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
import CustomVideo from "../atoms/CustomVideo";
import Link from "next/link";
import { PhotoFrame } from "../atoms/Frame";
const Headline = () => {
  const startTextStyle = {
    opacity: '0',
    transform: 'translateY(40px)'
  }
  const underline = useRef(null);
  const texts = [useRef(null), useRef(null), useRef(null)];
  useEffect(() => {
    let current = 0;
    let currentUnderline = 0;
    const underlineAnimation =(firstTime = false) => {
      const textEl = texts[currentUnderline].current as HTMLElement|null;
      const underlineEl = underline.current as HTMLElement|null;
      if (!textEl || !underlineEl) return;
      console.log('underline', currentUnderline);
      if (!firstTime) underlineEl.style.transitionDuration = '300ms';
      underlineEl.style.width = textEl.offsetWidth+'px';
      underlineEl.style.backgroundColor = textEl.getAttribute("data-color") as string;
      currentUnderline++;
      if (currentUnderline == texts.length) currentUnderline = 0;

    }
    const textAnimation = (firstTime = false) => {
      const textEl = texts[current].current as HTMLElement|null;
      if (!textEl) return;
      // if (firstTime) textEl.style.transitionDelay = '300ms';
      textEl.style.transform = 'translateY(0)';
      textEl.style.opacity = '1';
      current++;
      if (current == texts.length) current = 0;
      setTimeout(() => {
        textEl.style.transform = "translateY(-40px)";
        textEl.style.opacity = '0';
        const resetToOriginialState = () => {
          textEl.style.opacity = startTextStyle.opacity;
          textEl.style.transform = startTextStyle.transform;
          textEl.removeEventListener('transitionend', resetToOriginialState);
        }
        textEl.addEventListener('transitionend', resetToOriginialState);
      }, 6000);
    };
    let textAnimationInterval: ReturnType<typeof setInterval>;
    let underlineAnimationInterval: ReturnType<typeof setInterval>;
    setTimeout(() => {
      underlineAnimation(true);
      setTimeout(() => {
        textAnimation(true);
        textAnimationInterval = setInterval(textAnimation, 6200);
        underlineAnimationInterval = setInterval(underlineAnimation, 6200);
      }, 300);
    }, 300);
    return () => {
      clearInterval(textAnimationInterval);
      clearInterval(underlineAnimationInterval);
    }
  }, []);
  return (
    <div className="h1 grid grid-cols-1">
    <div className="row-start-1 row-span-1 col-start-1 col-span-1 w-full opacity-0 animate-slide-in-fast animation-delay-100">Hi! I design and build</div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full  relative z-20">
      <span className="inline-block transition-all duration-300 ease-bounce" style={startTextStyle} ref={texts[0]} data-color="#13464b">digital products.</span></div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
      <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={texts[1]} data-color="#1a3059">web applications.</span>
    </div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
    <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={texts[2]} data-color="#5f276c">automate tools.</span>
    </div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 self-end h-4 bg-zinc-700 bottom-1 lg:bottom-2 transition-all duration-[800ms] relative z-10" ref={underline} style={{width: '0'}}></div>
    </div>
  )
}
interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  link?: string;
  gif?: HTMLElement|null;
}
const GifText = ({children, gif, link, ...rest}: GifTextProps) => {
  const showGif = () => {
    // console.log(gif);
    gif?.classList.add('animate-slide-in-fast');
  }
  const hideGif = () => {
    // console.log(gif);
    gif?.classList.remove('animate-slide-in-fast');
  }
  const span = <a className="underline underline-offset-1 transition-all duration-200 decoration-gray-600 hover:decoration-transparent inline-block -mx-2 px-2 py-1 rounded-xl hover:bg-white/5" onMouseOver={showGif} onMouseLeave={hideGif} {...rest}>{children}</a>;
  return (
    link ? <Link href={link}>{span}</Link> : span
  )
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
            <p className="font-display text-xl md:text-2xl mt-6 lg:mt-9 tracking-tight opacity-0 animate-slide-in-fast animation-delay-200">I am a <GifText gif={gif1?.current}>designer</GifText> x <GifText gif={gif2?.current}>developer</GifText> hybrid (maybe a  <GifText link="/about" title="Read more about this term" gif={gif3?.current}>design technologist</GifText>?). Everyday I try to make good products with the human at the center</p>
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
