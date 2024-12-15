import { cn } from "@lib/utils/cn";
import { useEffect, useMemo, useState } from "react";

const durationClass = {
  100: "duration-200",
  150: "duration-[150ms]",
  200: "duration-200",
  300: "duration-300",
  500: "duration-500",
};
// https://stackoverflow.com/questions/66049571/how-can-i-implement-a-as-prop-with-typescript-while-passing-down-the-props
export interface FadeProps<T extends React.ElementType> {
  show?: boolean | undefined;
  // appear?: boolean | undefined;
  children: React.ReactNode;
  as?: T;
  // showInView?: boolean;
  delay?: number; // in milisecond
  duration?: keyof typeof durationClass;
  className?: string;
  slide?: boolean;
  unmount?: boolean;
}

function Fade<T extends React.ElementType = "div">({
  children,
  // appear = false,
  show = true,
  as,
  delay,
  className,
  slide,
  duration = 300,
  unmount = true,
  ...rest
}: FadeProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof FadeProps<T>>) {
  const originStyles = cn(
    className,
    "transition-[opacity,transform] ease-in",
    duration && duration in durationClass && [durationClass[duration as number]]
  );
  const stateStyles = useMemo(
    () => ({
      show: ["opacity-100", { "translate-y-0": slide }],
      hide: ["opacity-0", { "translate-y-10": slide }],
    }),
    [slide]
  );
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(show);
  const [styles, setStyles] = useState(cn(originStyles, ...stateStyles.hide));
  const Component = as || "div";

  useEffect(() => {
    if (!ref) return;
    if (show) {
      setMounted(true);
      const timeout = setTimeout(
        () => setStyles(cn(originStyles, ...stateStyles.show)),
        delay
      );
      return () => {
        clearTimeout(timeout);
      };
    } else {
      const transitionProp =
        window.getComputedStyle(ref, null)["transition-property"] || "";

      // We just need to know how many transitions there are
      const numTransitionProps = transitionProp.split(",").length;
      let transitionCounter = 0;
      const unMountElement = () => {
        transitionCounter++;
        if (transitionCounter === numTransitionProps) {
          setMounted(false);
        }
      };
      ref.addEventListener("transitionend", unMountElement);
      setStyles(cn(originStyles, ...stateStyles.hide));
      return () => {
        ref.removeEventListener("transitionend", unMountElement);
      };
    }
  }, [ref, show, slide, originStyles, stateStyles, delay]);
  return (
    <Component className={styles} {...rest} ref={setRef}>
      {mounted ? children : null}
    </Component>
  );
}

export default Fade;
