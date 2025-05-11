"use client";
import { useState, useEffect } from "react";
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: undefined | number;
    height: undefined | number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    setWindowSize({
      width: document.body.offsetWidth,
      height: document.body.offsetHeight,
    });
    const observerCallback: ResizeObserverCallback = (
      entries: ResizeObserverEntry[],
    ) => {
      window.requestAnimationFrame((): void | undefined => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        for (let entry of entries) {
          const target = entry.target as HTMLElement;
          setWindowSize({
            width: target.offsetWidth || target.clientWidth,
            height: target.offsetHeight || target.clientHeight,
          });
        }
      });
    };
    const resizeObserver = new ResizeObserver(observerCallback);
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  // useEffect(() => {
  //   // Handler to call on window resize
  //   function handleResize() {
  //     // Set window width/height to state
  //     setWindowSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   }
  //   // Add event listener
  //   window.addEventListener("resize", handleResize);
  //   // Call handler right away so state gets updated with initial window size
  //   handleResize();
  //   // Remove event listener on cleanup
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
export default useWindowSize;
