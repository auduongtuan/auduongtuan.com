import clsx from "clsx";
import { useEffect, useState } from "react";

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
  ...rest
}: FadeProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof FadeProps<T>>) {
  const originStyles = clsx(
    className,
    "transition-[opacity,transform] ease-in",
    duration && duration in durationClass && [durationClass[duration as number]]
  );
  const [styles, setStyles] = useState(
    clsx(originStyles, {
      "opacity-0": true,
      "translate-y-10": slide,
    })
  );
  const Component = as || "div";
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(
        () =>
          setStyles(
            clsx(originStyles, "opacity-100", { "translate-y-0": slide })
          ),
        delay
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [slide, originStyles, show, delay]);
  return (
    <Component className={styles} {...rest}>
      {children}
    </Component>
  );
};

export default Fade;
