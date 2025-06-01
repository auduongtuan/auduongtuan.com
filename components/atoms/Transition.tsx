"use client";
import { CSSProperties, useEffect, useRef } from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { mergeProps } from "@base-ui-components/react/merge-props";
import { useTransitionStatus } from "@base-ui-components/react/utils";
import { cn } from "@lib/utils/cn";
import { useAnimationsFinished, useLatestRef } from "@hooks/base-ui";
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

export function Transition(props: TransitionProps) {
  const {
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
  } = props;

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(show);
  const showRef = useLatestRef(show);

  const combinedClassName = cn(
    className,
    transitionStatus === "starting" && typeof starting == "string" && starting,
    transitionStatus === "ending" && typeof ending == "string" && ending,
  );

  const ref = useRef<HTMLDivElement>(null);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, {
    waitForNextTick: show,
    subtree: listenToChildAnimations,
  });

  const rendered = useRender({
    render: children ? (
      typeof children === "function" ? (
        (props) =>
          (
            children as (props: React.HTMLAttributes<any>) => React.ReactElement
          )(props)
      ) : asChild && isValidElement(children) ? (
        () => children
      ) : (
        (props) => <section {...props}>{children}</section>
      )
    ) : (
      <div />
    ),
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
        if (!keepMounted) setMounted(show);
        onTransitionComplete?.(show);
      }
    });
  }, [show, keepMounted, runOnceAnimationsFinish, setMounted, showRef]);

  return mounted ? rendered : null;
}
