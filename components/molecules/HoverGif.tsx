"use client";
import { PhotoFrame } from "@atoms/Frame";
import { PreviewCard } from "@base-ui/react/preview-card";
import { event } from "@lib/gtag";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";
import React from "react";
import { hoverGifHandle, useHoverGifCursor } from "./HoverGifProvider";

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
  const router = useRouter();
  const { updateCursorX } = useHoverGifCursor();

  const cardContent = (
    <PhotoFrame name={label} inverted>
      {children}
    </PhotoFrame>
  );

  return (
    <PreviewCard.Trigger
      handle={hoverGifHandle}
      payload={cardContent}
      delay={100}
      closeDelay={500}
      render={(props) => {
        const originalOnMouseEnter = props.onMouseEnter;
        const originalOnMouseLeave = props.onMouseLeave;
        const originalOnMouseMove = props.onMouseMove;

        const eventHandlers = {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            event({
              action: "hover_gif",
              category:
                router.pathname === "/about" ? "about_page" : "engagement",
              label: label,
            });
            trackEvent({
              event: "hover_gif",
              content: label,
              page: router.pathname,
            });
            const rect = e.currentTarget.getBoundingClientRect();
            updateCursorX(e.clientX, rect);
            originalOnMouseEnter?.(e);
          },
          onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            updateCursorX(e.clientX, rect);
            originalOnMouseMove?.(e);
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            originalOnMouseLeave?.(e);
          },
        };

        if (suffix) {
          return (
            <span {...props} {...eventHandlers}>
              {text}
              {suffix}
            </span>
          );
        }

        return React.cloneElement(
          text as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            ...props,
            ...eventHandlers,
          },
        );
      }}
    />
  );
}
