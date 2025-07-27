import { useEffect, useState, useCallback, useMemo } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * A responsive breakpoint hook using window.matchMedia for optimal performance.
 * 
 * @param ssrBreakpoint - The breakpoint to use during SSR and before hydration.
 *                       Defaults to "lg" for better SEO (search engines typically use desktop viewports).
 * 
 * @example
 * ```tsx
 * // Default: uses "lg" for SSR
 * const bp = useBreakpoint();
 * 
 * // Custom SSR breakpoint
 * const bp = useBreakpoint("md");
 * 
 * // Usage
 * bp.breakpoint     // Current breakpoint: "sm" | "md" | "lg" | "xl" | "2xl"
 * bp.up("md")       // true if screen >= 768px
 * bp.down("lg")     // true if screen < 1024px
 * bp.between("md", "xl")  // true if 768px <= screen < 1280px
 * bp.only("lg")     // true if screen is exactly in "lg" range
 * ```
 */
const useBreakpoint = (ssrBreakpoint: Breakpoint = "lg") => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(ssrBreakpoint);
  const [isHydrated, setIsHydrated] = useState(false);

  // Generate media queries
  const mediaQueries = useMemo(() => {
    const queries: Record<Breakpoint, MediaQueryList> = {} as any;
    if (typeof window !== 'undefined') {
      queries.sm = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
      queries.md = window.matchMedia(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
      queries.lg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`);
      queries.xl = window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px) and (max-width: ${BREAKPOINTS["2xl"] - 1}px)`);
      queries["2xl"] = window.matchMedia(`(min-width: ${BREAKPOINTS["2xl"]}px)`);
    }
    return queries;
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    const updateBreakpoint = () => {
      let currentBp: Breakpoint = "sm";
      
      if (mediaQueries["2xl"]?.matches) currentBp = "2xl";
      else if (mediaQueries.xl?.matches) currentBp = "xl";
      else if (mediaQueries.lg?.matches) currentBp = "lg";
      else if (mediaQueries.md?.matches) currentBp = "md";
      else currentBp = "sm";

      setBreakpoint(currentBp);
    };

    // Initial check
    updateBreakpoint();

    // Add listeners
    Object.values(mediaQueries).forEach(mq => {
      if (mq) mq.addEventListener('change', updateBreakpoint);
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        if (mq) mq.removeEventListener('change', updateBreakpoint);
      });
    };
  }, [mediaQueries, isHydrated]);

  // Min width check: is current width >= breakpoint
  const up = useCallback((bp: Breakpoint) => {
    if (typeof window === 'undefined' || !isHydrated) {
      // SSR fallback: check if ssrBreakpoint >= bp
      return BREAKPOINTS[breakpoint] >= BREAKPOINTS[bp];
    }
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`);
    return mq.matches;
  }, [isHydrated, breakpoint]);

  // Max width check: is current width < breakpoint
  const down = useCallback((bp: Breakpoint) => {
    if (typeof window === 'undefined' || !isHydrated) {
      // SSR fallback: check if ssrBreakpoint < bp
      return BREAKPOINTS[breakpoint] < BREAKPOINTS[bp];
    }
    const mq = window.matchMedia(`(max-width: ${BREAKPOINTS[bp] - 1}px)`);
    return mq.matches;
  }, [isHydrated, breakpoint]);

  // Range check: is current width between min and max breakpoints
  const between = useCallback((minBp: Breakpoint, maxBp: Breakpoint) => {
    if (typeof window === 'undefined' || !isHydrated) {
      // SSR fallback: check if minBp <= ssrBreakpoint < maxBp
      return BREAKPOINTS[breakpoint] >= BREAKPOINTS[minBp] && BREAKPOINTS[breakpoint] < BREAKPOINTS[maxBp];
    }
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[minBp]}px) and (max-width: ${BREAKPOINTS[maxBp] - 1}px)`);
    return mq.matches;
  }, [isHydrated, breakpoint]);

  // Only check: is current width only within this breakpoint range
  const only = useCallback((bp: Breakpoint) => {
    if (typeof window === 'undefined' || !isHydrated) {
      // SSR fallback: check if ssrBreakpoint === bp
      return breakpoint === bp;
    }
    
    const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[];
    const currentIndex = breakpointKeys.indexOf(bp);
    const nextBp = breakpointKeys[currentIndex + 1];
    
    let query: string;
    if (currentIndex === 0) {
      // For 'sm', check if width < md
      query = `(max-width: ${BREAKPOINTS.md - 1}px)`;
    } else if (!nextBp) {
      // For highest breakpoint, check if width >= current
      query = `(min-width: ${BREAKPOINTS[bp]}px)`;
    } else {
      // For middle breakpoints, check range
      query = `(min-width: ${BREAKPOINTS[bp]}px) and (max-width: ${BREAKPOINTS[nextBp] - 1}px)`;
    }
    
    const mq = window.matchMedia(query);
    return mq.matches;
  }, [isHydrated, breakpoint]);

  return {
    breakpoint,
    up,
    down,
    between,
    only,
  };
};

export default useBreakpoint;