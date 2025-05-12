import { useState, useEffect } from "react";
import useWindowSize from "./useWindowSize";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>();
  const { width } = useWindowSize();
  useEffect(() => {
    if (!width) return;
    let bp = "sm";
    if (width >= BREAKPOINTS.sm) bp = "md";
    if (width >= BREAKPOINTS.md) bp = "lg";
    if (width >= BREAKPOINTS.lg) bp = "xl";
    if (width >= BREAKPOINTS.xl) bp = "2xl";
    if (width >= BREAKPOINTS["2xl"]) bp = "3xl";
    setBreakpoint(bp as Breakpoint);
  }, [width]);

  return breakpoint;
};

export default useBreakpoint;
