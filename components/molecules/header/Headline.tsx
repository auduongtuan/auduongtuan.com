import React, { useEffect, useRef, useState } from "react";
import useWindowSize from "@hooks/useWindowSize";
import Fade from "@atoms/Fade";
const startTextStyle = {
  opacity: "0",
  transform: "translateY(40px)",
};
const Headline = () => {
  const underline = useRef(null);
  const texts = useRef<(HTMLElement | null)[]>([]);
  const size = useWindowSize();
  // const {outerWidth} = useWindowSize();
  const activeTextIndex = useRef(0);
  useEffect(() => {
    const textAnimation = (firstTime = false) => {
      // const underlineEl = underline.current as HTMLElement | null;
      const textEl = texts.current[
        activeTextIndex.current
      ] as HTMLElement | null;
      if (!textEl) return;
      // if (!underlineEl) return;

      // text
      textEl.style.transform = "translateY(0)";
      textEl.style.opacity = "1";
      activeTextIndex.current++;
      if (activeTextIndex.current == texts.current.length)
        activeTextIndex.current = 0;

      // // underline
      // if (!firstTime) underlineEl.style.transitionDuration = "300ms";
      // underlineEl.style.width = textEl.offsetWidth + "px";
      // underlineEl.style.backgroundColor = textEl.getAttribute(
      //   "data-color"
      // ) as string;

      setTimeout(() => {
        textEl.style.transform = "translateY(-40px)";
        textEl.style.opacity = "0";
        const resetToOriginialState = () => {
          textEl.style.opacity = startTextStyle.opacity;
          textEl.style.transform = startTextStyle.transform;
          textEl.removeEventListener("transitionend", resetToOriginialState);
          textAnimation();
        };
        textEl.addEventListener("transitionend", resetToOriginialState);
      }, 6000);
    };
    setTimeout(() => textAnimation(true), 300);
    return () => {};
  }, [texts]);
  useEffect(() => {
    const underlineEl = underline.current as HTMLElement | null;
    const textEl = texts.current[activeTextIndex.current] as HTMLElement | null;
    if (!textEl || !underlineEl) return;
    underlineEl.style.width = textEl.offsetWidth + "px";
  }, [size.width]);
  return (
    <div className="relative grid grid-cols-1 text-center font-display place-items-center h1 leading-[0.95]">
      <Fade
        className="w-full col-span-1 col-start-1 row-span-1 row-start-1 text-center place-items-center"
        slide
      >
        I <span className="font-serif italic font-medium">design</span> and{" "}
        <span className="font-serif italic font-medium">build</span>
      </Fade>
      <div className="relative z-20 col-span-1 col-start-1 row-span-1 row-start-2 w-ful">
        <span
          className="inline-block transition-all duration-200 ease-bounce"
          style={startTextStyle}
          ref={(el) => (texts.current[0] = el)}
          data-color="#b5d1d4"
        >
          digital products.
        </span>
      </div>
      <div className="relative z-20 w-full col-span-1 col-start-1 row-span-1 row-start-2">
        <span
          className="inline-block transition-all duration-200 ease-bounce "
          style={startTextStyle}
          ref={(el) => (texts.current[1] = el)}
          data-color="#b3c4e2"
        >
          web applications.
        </span>
      </div>
      <div className="relative z-20 w-full col-span-1 col-start-1 row-span-1 row-start-2">
        <span
          className="inline-block transition-all duration-200 ease-bounce "
          style={startTextStyle}
          ref={(el) => (texts.current[2] = el)}
          data-color="#dfcae4"
        >
          automate tools.
        </span>
      </div>
      {/* <div
        className="row-start-2 row-span-1 col-start-1 col-span-1 self-end h-2 md:h-3 lg:h-4 bg-transparent bottom-0.5 lg:bottom-1 transition-all duration-[800ms] relative z-10"
        ref={underline}
        style={{ width: "0" }}
      ></div> */}
    </div>
  );
};
Headline.displayName = "Headline";
export default Headline;
