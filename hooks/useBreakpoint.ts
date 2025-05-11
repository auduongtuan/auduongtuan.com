import { useState, useEffect } from "react";
import useWindowSize from "./useWindowSize";

type Breakpoint = "sm" | "md" | "lg" | "xl";
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>();
  const { width } = useWindowSize();
  useEffect(() => {
    if (!width) return;
    let bp = "xl";
    if (width < BREAKPOINTS.lg) bp = "lg";
    if (width < BREAKPOINTS.md) bp = "md";
    if (width < BREAKPOINTS.sm) bp = "sm";
    setBreakpoint(bp as Breakpoint);
  }, [width]);

  return breakpoint;
};

export default useBreakpoint;
