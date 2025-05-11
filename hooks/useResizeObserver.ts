"use client";
import { useEffect, useState } from "react";

export const useResizeObserver = (ref: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });
  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        setSize({
          width: target.offsetWidth || target.clientWidth,
          height: target.offsetHeight || target.clientHeight,
        });
      }
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);
  return size;
};
