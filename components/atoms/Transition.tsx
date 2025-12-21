"use client";
import { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { useValueAsRef } from "@base-ui/utils/useValueAsRef";
import { cn } from "@lib/utils/cn";
import { useAnimationsFinished, useTransitionStatus } from "@hooks";
import { JSX, isValidElement } from "react";

export type TransitionProps = Omit<
  useRender.ComponentProps<"div">,
  "render" | "children"
> & {
  /** Whether the component should be shown */
  show?: boolean;
  /** CSS classes to apply when the component is opened */
  starting?: string | CSSProperties;
  /** CSS classes to apply when the component is closed */
  ending?: string | CSSProperties;
  /** CSS classes to apply to the component */
  className?: string;
  /** Keep mounted */
  keepMounted?: boolean;
  /**
   * Callback function to be called when the transition ends
   */
  onTransitionComplete?: (show?: boolean) => void;
  /**
   * Whether to listen for animations in child elements
   */
  listenToChildAnimations?: boolean;
  /**
   * Whether to render the child as a child element
   * @default true
   */
  asChild?: boolean;
  children?: React.ReactNode | useRender.ComponentProps<"div">["render"];
};

export function Transition({
  children = <div />,
  className,
  starting,
  ending,
  show = true,
  keepMounted = false,
  onTransitionComplete,
  listenToChildAnimations = false,
  asChild = true,
  ...otherProps
}: TransitionProps) {
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(show);
  const showRef = useValueAsRef(show);

  const combinedClassName = useMemo(
    () =>
      cn(
        className,
        transitionStatus === "starting" &&
          typeof starting == "string" &&
          starting,
        transitionStatus === "ending" && typeof ending == "string" && ending,
        // hide by display: none when not mounted and keepMounted is true
        mounted == false && keepMounted ? "hidden" : undefined,
      ),
    [className, starting, ending, transitionStatus, mounted, keepMounted],
  );

  const ref = useRef<HTMLDivElement>(null);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, {
    waitForNextTick: show,
    subtree: listenToChildAnimations,
  });

  const getRender = useCallback(() => {
    if (typeof children === "function") {
      return children;
    }
    if (asChild && isValidElement(children)) {
      return children;
    }
    return <div>{children}</div>;
  }, [children, asChild]);

  const rendered = useRender({
    render: getRender(),
    props: mergeProps<"div">(otherProps, {
      ref,
      className: combinedClassName,
      ...{
        "data-starting": transitionStatus === "starting" ? "true" : undefined,
        "data-ending": transitionStatus === "ending" ? "true" : undefined,
      },
      style: {
        ...(transitionStatus === "starting" && typeof starting === "object"
          ? starting
          : {}),
        ...(transitionStatus === "ending" && typeof ending === "object"
          ? ending
          : {}),
      },
    }),
  });

  useEffect(() => {
    runOnceAnimationsFinish(() => {
      if (show === showRef.current) {
        setMounted(show);
        onTransitionComplete?.(show);
      }
    });
  }, [
    show,
    keepMounted,
    runOnceAnimationsFinish,
    setMounted,
    showRef,
    onTransitionComplete,
  ]);

  return mounted || keepMounted ? rendered : null;
}
