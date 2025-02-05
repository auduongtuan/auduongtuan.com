import React, { ReactElement, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  useHover,
  useFocus,
  useInteractions,
} from "@floating-ui/react";
import { Transition, TransitionChild } from "@headlessui/react";
export interface TooltipProps extends React.ComponentPropsWithoutRef<"div"> {
  content?: string;
  children?: ReactElement;
  onOpenChange?: (open: boolean) => void;
}
const Tooltip = ({
  ref: forwardedRef,
  content,
  children,
  onOpenChange,
  ...props
}: TooltipProps & {
  ref?: React.RefObject<HTMLElement>;
}) => {
  const [show, setShow] = useState(false);
  const { x, y, refs, strategy, context } = useFloating({
    placement: "top",
    middleware: [shift(), offset(4)],
    whileElementsMounted: autoUpdate,
    open: show,
    onOpenChange: (open) => {
      setShow(open);
      if (onOpenChange) onOpenChange(open);
    },
  });
  const hover = useHover(context);
  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const allChildEvents = Object.keys(children?.props as object)
    .filter((eventName) => eventName.startsWith("on"))
    .reduce((obj, eventName) => {
      obj[eventName] = (children?.props as Record<string, any>)[eventName];
      return obj;
    }, {});

  const childrenWithProps = React.cloneElement(children as ReactElement<any>, {
    ref: (el: HTMLElement) => {
      refs.setReference(el);
      if (forwardedRef) forwardedRef.current = el;
      // setup ref for children
      if (
        children?.props &&
        typeof children?.props == "object" &&
        "ref" in children?.props
      ) {
        if (typeof children?.props.ref === "function") {
          children?.props.ref(el);
        } else {
          if (
            children?.props.ref &&
            typeof children?.props.ref == "object" &&
            "current" in children?.props.ref
          )
            children.props.ref.current = el;
        }
      }
    },
    // ...getReferenceProps(),
    ...getReferenceProps(allChildEvents),
    "aria-label": content,
    ...props,
  });

  return (
    <React.Fragment>
      {childrenWithProps}
      {mounted
        ? ReactDOM.createPortal(
            <Transition show={show}>
              <div
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? "",
                  left: x ?? "",
                }}
                {...getFloatingProps()}
                {...props}
              >
                <TransitionChild
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="ease inline-flex max-w-[48ch] rounded-lg bg-blue-800 px-2 py-1 font-mono text-sm font-medium text-white shadow-md transition-all duration-300">
                    {content}
                  </div>
                </TransitionChild>
              </div>
            </Transition>,
            document.querySelector("body") as HTMLElement,
          )
        : null}
    </React.Fragment>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
