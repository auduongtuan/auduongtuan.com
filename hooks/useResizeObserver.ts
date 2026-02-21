"use client";
import { useEffect, useRef, useState } from "react";

export const useResizeObserver = <T extends Element = HTMLElement>(
  ref?: React.RefObject<T | null>,
) => {
  const [size, setSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  });
  const targetRef = ref || (useRef<T>(null) as React.RefObject<T>);
  useEffect(() => {
    if (!targetRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        setSize({
          width: target.offsetWidth || target.clientWidth,
          height: target.offsetHeight || target.clientHeight,
        });
      }
    });
    resizeObserver.observe(targetRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);
  return { ...size, ref: targetRef };
};
