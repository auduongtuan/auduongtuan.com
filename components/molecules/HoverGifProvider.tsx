"use client";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@lib/utils/cn";

export const hoverGifHandle = PreviewCard.createHandle<React.ReactElement>();

export function HoverGifProvider() {
  return (
    <PreviewCard.Root handle={hoverGifHandle}>
      {({ payload }) => (
        <PreviewCard.Portal>
          <PreviewCard.Positioner
            sideOffset={8}
            className="z-[100] transition-[left,top] duration-200 ease-out"
          >
            <PreviewCard.Popup
              className={cn(
                "origin-[var(--transform-origin)]",
                "transition-[scale,opacity] duration-200",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0"
              )}
            >
              <PreviewCard.Viewport
                className={cn(
                  "flex overflow-hidden",
                  "transition-[height] duration-200 ease-out",
                  "[&>*]:min-w-full [&>*]:shrink-0",
                  "[&>*]:transition-opacity [&>*]:duration-200",
                  "[&>*[data-viewport-item-leaving]]:opacity-0",
                  "[&>*[data-viewport-item-entering]]:opacity-0"
                )}
              >
                {payload}
              </PreviewCard.Viewport>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      )}
    </PreviewCard.Root>
  );
}
