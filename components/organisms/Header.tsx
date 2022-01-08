import React, {useEffect, useRef} from "react";
import Button from "../atoms/Button";
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
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
      currentUnderline++;
      if (currentUnderline == texts.length) currentUnderline = 0;

    }
    const textAnimation = (firstTime = false) => {
      const textEl = texts[current].current as HTMLElement|null;
      if (!textEl) return;
      if (firstTime) textEl.style.transitionDelay = '300ms';
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
      textAnimation(true);
      textAnimationInterval = setInterval(textAnimation, 6200);
      underlineAnimationInterval = setInterval(underlineAnimation, 6200);
    }, 300);
    return () => {
      clearInterval(textAnimationInterval);
      clearInterval(underlineAnimationInterval);
    }
  }, []);
  return (
    <header ref={ref} className="bg-neutral-900 text-white w-full z-10">
      <div className="main-container pt-32 pb-32 lg:pt-40 lg:pb-42">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-9 lg:max-w-[50rem]">
            <div className="font-display text-4xl md:text-5xl lg:text-7xl leading-24 lg:leading-[5rem] font-bold tracking-tight grid grid-cols-1">
            <div className="row-start-1 row-span-1 col-start-1 col-span-1 w-full opacity-0 animate-slide-in-fast animation-delay-100">Hi! I design and build</div>
            <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full  relative z-20">
              <span className="inline-block transition-all duration-300 ease-bounce" style={startTextStyle} ref={texts[0]}>digital products.</span></div>
            <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
              <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={texts[1]}>web applications.</span>
            </div>
            <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
             <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={texts[2]}>automate tools.</span>
            </div>
            <div className="row-start-2 row-span-1 col-start-1 col-span-1 self-end h-[6px] bg-[#9FC3FF] transition-all duration-[800ms] relative z-10" ref={underline} style={{width: '0'}}></div>
            </div>
            <p className="font-display text-xl md:text-2xl mt-9 tracking-tight opacity-0 animate-slide-in-fast animation-delay-200">I am a designer x developer hybrid (maybe a design technologist?). Everyday I try to make good products with the human at the center</p>
            <Button href="/about" className="mt-10 opacity-0 animate-slide-in-fast animation-delay-300" colorful arrow>
              Get to know me
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
