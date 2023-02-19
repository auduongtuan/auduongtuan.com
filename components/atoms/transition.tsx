import { Transition, TransitionClasses } from "@headlessui/react";
import classNames from "classnames";
import { useRef, useEffect, useState } from "react";

const delayClass = {
  0: "",
  50: "delay-[50ms]",
  100: "delay-[100ms]",
  150: "delay-[150ms]",
  200: "delay-[200ms]",
  250: "delay-[250ms]",
  300: "delay-[300ms]",
  350: "delay-[350ms]",
  400: "delay-[400ms]",
  450: "delay-[450ms]",
  500: "delay-[500ms]",
  550: "delay-[550ms]",
  600: "delay-[600ms]",
  650: "delay-[650ms]",
  700: "delay-[700ms]",
  750: "delay-[750ms]",
  800: "delay-[800ms]",
};

const durationClass = {
  100: "duration-200",
  150: "duration-[150ms]",
  200: "duration-200",
  300: "duration-300",
  500: "duration-500",
};

export interface FadeProps extends TransitionClasses {
  show?: boolean | undefined;
  appear?: boolean | undefined;
  children: React.ReactNode;
  as?: React.ElementType;
  showInView?: boolean;
  delay?: keyof typeof delayClass; // in milisecond
  duration?: keyof typeof durationClass;
  className?: string;
  unmount?: boolean;
  slide?: boolean;
}

const Fade = ({
  children,
  appear = false,
  show = true,
  delay,
  className,
  slide,
  duration = 300,
  ...rest
}: FadeProps) => {
  return (
    <Transition
      show={show}
      appear={appear}
      enter={classNames("transition", "ease-in", durationClass[duration], {
        [delayClass[delay as number]]: delay && delay in delayClass,
      })}
      enterFrom={classNames("opacity-0", { "translate-y-10": slide })}
      enterTo={classNames("opacity-100", { "translate-y-0": slide })}
      leave={`transition duration-200 ${
        delay && delay in delayClass ? delayClass[delay] : ""
      }`}
      leaveFrom={classNames("opacity-100", { "translate-y-0": slide })}
      leaveTo={classNames("opacity-0", { "translate-y-10": slide })}
      className={classNames(className, {
        "opacity-0": appear,
        "translate-y-10": appear && slide,
      })}
      {...rest}
    >
      {children}
    </Transition>
  );
};

export default Fade;
