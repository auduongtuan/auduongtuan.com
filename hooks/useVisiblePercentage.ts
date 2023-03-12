import { useState, useRef, useEffect } from "react";
function useVisibleRatio() {
  const [visibleRatio, setVisibleRatio] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current as HTMLElement;
    // console.log(index, project.meta.title);

    const handleScroll = () => {
      // if(ref.current) setScrollPosition(getElementVisibility(ref.current).visibleRatio);

      const vh = document.documentElement.clientHeight;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh) {
        setVisibleRatio(Math.min((vh - rect.top + 200) / rect.height, 1));
      } else {
        // console.log('now show', project.meta.title)
      }
      // console.log(scrollPosition);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return {ref, visibleRatio};
}
export default useVisibleRatio;