import React from "react";
import { PhotoFrame } from "@atoms/Frame";
import {
  autoUpdate,
  offset,
  safePolygon,
  shift,
  size,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { Portal, Transition } from "@headlessui/react";
import { event } from "@lib/gtag";
import { useState } from "react";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { refs, floatingStyles, context } = useFloating({
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
    onOpenChange: (open) => {
      setShowGif(open);
      if (open) {
        event({
          action: "hover_gif",
          category: router.pathname == "/about" ? "about_page" : "engagement",
          label: label,
        });
        trackEvent({
          event: "hover_gif",
          content: label,
          page: router.pathname,
        });
      }
    },
  });
  const hover = useHover(context, {
    handleClose: safePolygon({
      requireIntent: false,
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const el = React.cloneElement(text as React.ReactElement<any>, {
    ref: refs.setReference,
    ...getReferenceProps(),
  });
  return (
    <>
      {el}
      <Portal>
        <div
          ref={refs.setFloating}
          className="z-40"
          style={floatingStyles}
          {...getFloatingProps()}
        >
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
