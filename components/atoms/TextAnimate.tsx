"use client";

import { cn } from "@lib/utils/cn";
import { ElementType, memo, useEffect, useRef, useState } from "react";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

interface TextAnimateProps {
  /**
   * The text content to animate
   */
  children: React.ReactNode;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The class name to be applied to each segment
   */
  segmentClassName?: string;
  /**
   * The delay before the animation starts (in ms)
   */
  delay?: number;
  /**
   * The duration of each segment animation (in ms)
   */
  duration?: number;
  /**
   * The element type to render
   */
  as?: ElementType;
  /**
   * How to split the text ("text", "word", "character")
   */
  by?: AnimationType;
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * The animation preset to use
   */
  animation?: AnimationVariant;
}

const staggerTimings: Record<AnimationType, number> = {
  text: 60,
  word: 50,
  character: 30,
  line: 60,
};

const animationClasses: Record<
  AnimationVariant,
  { initial: string; animate: string }
> = {
  fadeIn: {
    initial: "opacity-0 translate-y-5",
    animate: "opacity-100 translate-y-0",
  },
  blurIn: {
    initial: "opacity-0 blur-sm",
    animate: "opacity-100 blur-none",
  },
  blurInUp: {
    initial: "opacity-0 blur-sm translate-y-5",
    animate: "opacity-100 blur-none translate-y-0",
  },
  blurInDown: {
    initial: "opacity-0 blur-sm -translate-y-5",
    animate: "opacity-100 blur-none translate-y-0",
  },
  slideUp: {
    initial: "opacity-0 translate-y-5",
    animate: "opacity-100 translate-y-0",
  },
  slideDown: {
    initial: "opacity-0 -translate-y-5",
    animate: "opacity-100 translate-y-0",
  },
  slideLeft: {
    initial: "opacity-0 translate-x-5",
    animate: "opacity-100 translate-x-0",
  },
  slideRight: {
    initial: "opacity-0 -translate-x-5",
    animate: "opacity-100 translate-x-0",
  },
  scaleUp: {
    initial: "opacity-0 scale-50",
    animate: "opacity-100 scale-100",
  },
  scaleDown: {
    initial: "opacity-0 scale-150",
    animate: "opacity-100 scale-100",
  },
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 300,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  ...props
}: TextAnimateProps) => {
  const [isVisible, setIsVisible] = useState(!startOnView);
  const [animatedSegments, setAnimatedSegments] = useState<Set<number>>(
    new Set(),
  );
  const ref = useRef<HTMLElement>(null);

  let segments: React.ReactNode[] = Array.isArray(children)
    ? children
    : [children];

  if (typeof children === "string") {
    switch (by) {
      case "word":
        segments = children.split(/(\s+)/);
        break;
      case "character":
        segments = children.split("");
        break;
      case "line":
        segments = children.split("\n");
        break;
      case "text":
      default:
        break;
    }
  }

  useEffect(() => {
    if (!startOnView) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
          setAnimatedSegments(new Set());
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startOnView, once]);

  useEffect(() => {
    if (!isVisible) return;

    const staggerDelay = staggerTimings[by];

    segments.forEach((_, index) => {
      const segmentDelay = delay + index * staggerDelay;

      setTimeout(() => {
        setAnimatedSegments((prev) => new Set([...prev, index]));
      }, segmentDelay);
    });
  }, [isVisible, delay, by, segments.length]);

  const { initial, animate } = animationClasses[animation];

  return (
    <Component
      ref={ref}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {segments.map((segment, i) => {
        const isAnimated = animatedSegments.has(i);
        const transitionDuration = `duration-${Math.min(Math.max(Math.round(duration / 100) * 100, 100), 1000)}`;

        return (
          <span
            key={`${by}-${segment}-${i}`}
            className={cn(
              "transition-all ease-out",
              transitionDuration,
              by === "line" ? "block" : "inline-block whitespace-pre",
              isAnimated ? animate : initial,
              segmentClassName,
            )}
            style={{
              transitionDuration: `${duration}ms`,
            }}
          >
            {segment}
          </span>
        );
      })}
    </Component>
  );
};

// Export the memoized version
export const TextAnimate = memo(TextAnimateBase);
