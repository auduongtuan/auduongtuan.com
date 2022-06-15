import React, {useEffect, useRef, useMemo} from "react";
const Headline = React.memo(() => {
  const startTextStyle = {
    opacity: '0',
    transform: 'translateY(40px)'
  }
  const underline = useRef(null);
  const texts = useRef<(HTMLElement | null)[]>([]);
  // const {outerWidth} = useWindowSize();
  useEffect(() => {
    let current = 0;
    const textAnimation = (firstTime = false) => {
      const underlineEl = underline.current as HTMLElement|null;
      const textEl = texts.current[current] as HTMLElement|null;
      if (!textEl || !underlineEl) return;

      // text
      textEl.style.transform = 'translateY(0)';
      textEl.style.opacity = '1';
      current++;
      if (current == texts.current.length) current = 0;

      // underline
      if (!firstTime) underlineEl.style.transitionDuration = '300ms';
      underlineEl.style.width = textEl.offsetWidth+'px';
      underlineEl.style.backgroundColor = textEl.getAttribute("data-color") as string;

      setTimeout(() => {
        textEl.style.transform = "translateY(-40px)";
        textEl.style.opacity = '0';
        const resetToOriginialState = () => {
          textEl.style.opacity = startTextStyle.opacity;
          textEl.style.transform = startTextStyle.transform;
          textEl.removeEventListener('transitionend', resetToOriginialState);
          textAnimation();
        }
        textEl.addEventListener('transitionend', resetToOriginialState);
      }, 6000);
    };
    setTimeout(() => textAnimation(true), 600);
    return () => {
    }
  }, [startTextStyle.opacity, startTextStyle.transform, texts]);
  return (
    <div className="h1 grid grid-cols-1">
    <div className="row-start-1 row-span-1 col-start-1 col-span-1 w-full opacity-0 animate-slide-in-fast animation-delay-100">Hi! I design and build</div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full  relative z-20">
      <span className="inline-block transition-all duration-300 ease-bounce" style={startTextStyle} ref={el => texts.current[0] = el} data-color="#13464b">digital products.</span></div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
      <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={el => texts.current[1] = el} data-color="#1a3059">web applications.</span>
    </div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 w-full relative z-20">
    <span className="inline-block transition-all duration-300 ease-bounce " style={startTextStyle} ref={el => texts.current[2] = el} data-color="#5f276c">automate tools.</span>
    </div>
    <div className="row-start-2 row-span-1 col-start-1 col-span-1 self-end h-2 md:h-3 lg:h-4 bg-slate-700 bottom-0.5 lg:bottom-2 transition-all duration-[800ms] relative z-10" ref={underline} style={{width: '0'}}></div>
    </div>
  )
});
Headline.displayName = 'Headline';
export default Headline;