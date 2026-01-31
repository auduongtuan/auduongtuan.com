"use client";
import { PhotoFrame } from "@atoms/Frame";
import { PreviewCard } from "@base-ui/react/preview-card";
import { event } from "@lib/gtag";
import { trackEvent } from "@lib/utils";
import { useRouter } from "next/router";
import React from "react";
import { hoverGifHandle } from "./HoverGifProvider";

export default function HoverGif({
  text,
  children,
  label,
}: {
  text: React.ReactElement;
  label: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

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
      closeDelay={100}
      render={(props) => {
        const originalOnMouseEnter = props.onMouseEnter;
        return React.cloneElement(
          text as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            ...props,
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
              originalOnMouseEnter?.(e);
            },
          },
        );
      }}
    />
  );
}
