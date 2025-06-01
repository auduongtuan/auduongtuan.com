"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
import { event } from "@lib/gtag";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";
import { Transition } from "@atoms/Transition";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <>
      {el}
      {isMounted &&
        showGif &&
        ReactDOM.createPortal(
          <div
            ref={refs.setFloating}
            className="z-40"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <Transition
              show={true}
              starting="opacity-0 translate-y-10"
              ending="opacity-0 translate-y-10"
              className="translate-y-0 transition-all duration-200"
            >
              <PhotoFrame name={label} inverted>
                {children}
              </PhotoFrame>
            </Transition>
          </div>,
          document.body,
        )}
    </>
  );
}
