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
import { Transition } from "@headlessui/react";
export interface TooltipProps {
  content?: string;
  children?: ReactElement;
}
const Tooltip = ({ content, children, ...props }: TooltipProps) => {
  const [show, setShow] = useState(false);
  const { x, y, refs, strategy, context } = useFloating({
    placement: "top",
    middleware: [shift(), offset(4)],
    whileElementsMounted: autoUpdate,
    open: show,
    onOpenChange: setShow,
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
  const allChildEvents = Object.keys(children?.props)
    .filter((eventName) => eventName.startsWith("on"))
    .reduce((obj, eventName) => {
      obj[eventName] = children?.props[eventName];
      return obj;
    }, {});
  const childrenWithProps = React.cloneElement(children as ReactElement, {
    ref: refs.setReference,
    ...getReferenceProps(allChildEvents),
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
              >
                <Transition.Child
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="bg-blue-800 text-white font-medium px-2 py-1 text-sm rounded-lg shadow-md transition-all ease duration-300">
                    {content}
                  </div>
                </Transition.Child>
              </div>
            </Transition>,
            document.querySelector("body")
          )
        : null}
    </React.Fragment>
  );
};
export default Tooltip;
