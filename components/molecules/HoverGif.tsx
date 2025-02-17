import React from "react";
import { PhotoFrame } from "@atoms/Frame";
import {
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { Portal, Transition } from "@headlessui/react";
import { event } from "@lib/gtag";
import { useState } from "react";
import { trackEvent } from "@lib/utils";

export default function HoverGif({
  text,
  children,
  label,
}: {
  text: React.ReactElement;
  label: string;
  children: React.ReactNode;
}) {
  const [showGif, setShowGif] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [
      offset(8),
      shift({
        padding: 8,
      }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          // Change styles, e.g.
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
    open: showGif,
    whileElementsMounted: autoUpdate,
  });
  const el = React.cloneElement(text as React.ReactElement<any>, {
    onMouseEnter: (e: React.MouseEvent) => {
      setShowGif(true);
      event({
        action: "hover_gif",
        category: "about_page",
        label: label,
      });
      trackEvent({
        event: "hover_gif",
        content: label,
        page: window.location.pathname,
      });
    },
    onMouseLeave: () => {
      setShowGif(false);
    },
    ref: refs.setReference,
  });
  return (
    <>
      {el}
      <Portal>
        <div ref={refs.setFloating} className="z-40" style={floatingStyles}>
          <Transition
            show={showGif}
            enter="transition-all duration-200"
            enterFrom="opacity-0 translate-y-10"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-10"
          >
            <PhotoFrame name={label} inverted>
              {children}
            </PhotoFrame>
          </Transition>
        </div>
      </Portal>
    </>
  );
}
