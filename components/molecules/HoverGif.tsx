"use client";
import { PhotoFrame } from "@atoms/Frame";
import { Transition } from "@atoms/Transition";
import {
  autoUpdate,
  offset,
  safePolygon,
  shift,
  size,
  useClientPoint,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { event } from "@lib/gtag";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";
import React, { useEffect, useId, useState } from "react";
import ReactDOM from "react-dom";

// Global registry to track all active HoverGif instances
const activeInstances = new Map<string, () => void>();

export default function HoverGif({
  text,
  children,
  label,
  suffix,
}: {
  text: React.ReactElement;
  label: string;
  children: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const [showGif, setShowGif] = useState(false);
  const router = useRouter();
  const instanceId = useId(); // Unique ID for this instance
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
      if (open) {
        // Close all other instances before opening this one
        activeInstances.forEach((closeOther, otherId) => {
          if (otherId !== instanceId) {
            closeOther();
          }
        });

        // Analytics tracking
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

      setShowGif(open);
    },
  });
  const hover = useHover(context, {
    handleClose: safePolygon({
      requireIntent: false,
    }),
  });

  const clientPoint = useClientPoint(context, {
    axis: "x",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    clientPoint,
  ]);

  // Always wrap in span with stable line-height
  const el = (
    <span
      ref={refs.setReference}
      {...getReferenceProps()}
      style={{ lineHeight: "inherit" }}
    >
      {text}
      {suffix}
    </span>
  );

  const [isMounted, setIsMounted] = useState(false);

  // Register this instance on mount, unregister on unmount
  useEffect(() => {
    setIsMounted(true);

    // Register close function
    activeInstances.set(instanceId, () => setShowGif(false));

    return () => {
      setIsMounted(false);
      activeInstances.delete(instanceId);
    };
  }, [instanceId]);

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
              <PhotoFrame name={label}>{children}</PhotoFrame>
            </Transition>
          </div>,
          document.body,
        )}
    </>
  );
}
