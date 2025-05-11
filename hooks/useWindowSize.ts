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
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        setWindowSize({
          width: target.offsetWidth || target.clientWidth,
          height: target.offsetHeight || target.clientHeight,
        });
      }
    });
    resizeObserver.observe(document.documentElement);
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
