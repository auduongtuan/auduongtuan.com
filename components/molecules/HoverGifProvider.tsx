"use client";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@lib/utils/cn";
import { createContext, useContext, useRef, useCallback } from "react";

export const hoverGifHandle = PreviewCard.createHandle<React.ReactElement>();

interface HoverGifContextType {
  popupRef: React.RefObject<HTMLDivElement | null>;
  updateCursorX: (x: number, triggerRect: DOMRect) => void;
  resetCursorX: () => void;
}

const HoverGifContext = createContext<HoverGifContextType>({
  popupRef: { current: null },
  updateCursorX: () => {},
  resetCursorX: () => {},
});

export function useHoverGifCursor() {
  return useContext(HoverGifContext);
}

function HoverGifPopup({ popupRef }: { popupRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <PreviewCard.Root handle={hoverGifHandle}>
      {({ payload }) => (
        <PreviewCard.Portal>
          <PreviewCard.Positioner
            sideOffset={8}
            className="z-[100] transition-[left,top] duration-200 ease-out"
          >
            <PreviewCard.Popup
              ref={popupRef}
              className={cn(
                "origin-[var(--transform-origin)]",
                "transition-[scale,opacity,transform] duration-200",
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

export function HoverGifProvider({ children }: { children?: React.ReactNode }) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const updateCursorX = useCallback((x: number, triggerRect: DOMRect) => {
    if (popupRef.current) {
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const offset = x - triggerCenterX;
      popupRef.current.style.transform = `translateX(${offset}px)`;
    }
  }, []);

  const resetCursorX = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.style.transform = "translateX(0px)";
    }
  }, []);

  return (
    <HoverGifContext.Provider value={{ popupRef, updateCursorX, resetCursorX }}>
      {children}
      <HoverGifPopup popupRef={popupRef} />
    </HoverGifContext.Provider>
  );
}
