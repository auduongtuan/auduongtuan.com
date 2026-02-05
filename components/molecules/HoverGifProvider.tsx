"use client";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@lib/utils/cn";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";

export const hoverGifHandle = PreviewCard.createHandle<React.ReactElement>();

interface HoverGifContextType {
  popupRef: React.RefObject<HTMLDivElement | null>;
  updateCursorX: (x: number, triggerRect: DOMRect, instant?: boolean) => void;
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

function HoverGifPopup({
  popupRef,
}: {
  popupRef: React.RefObject<HTMLDivElement | null>;
}) {
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
                "transition-[scale,opacity] duration-200",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0",
              )}
            >
              <PreviewCard.Viewport
                className={cn(
                  "flex overflow-hidden",
                  "transition-[height] duration-200 ease-out",
                  "[&>*]:min-w-full [&>*]:shrink-0",
                  "[&>*]:transition-opacity [&>*]:duration-200",
                  "[&>*[data-viewport-item-leaving]]:opacity-0",
                  "[&>*[data-viewport-item-entering]]:opacity-0",
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
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const prevTriggerCenterRef = useRef<number | null>(null);

  const updateCursorX = useCallback(
    (x: number, triggerRect: DOMRect, isNewTrigger?: boolean) => {
      if (popupRef.current) {
        const newTriggerCenterX = triggerRect.left + triggerRect.width / 2;
        const finalOffset = x - newTriggerCenterX;

        if (isNewTrigger && prevTriggerCenterRef.current !== null) {
          const popup = popupRef.current;
          const positioner = popup.parentElement;

          // Target position - keep popup at cursor
          const targetCenter = x;

          // Track the popup position for the duration of the Positioner transition
          const startTime = performance.now();
          const duration = 200; // Match Positioner transition duration

          const trackPosition = () => {
            const elapsed = performance.now() - startTime;
            const positionerRect = positioner?.getBoundingClientRect();
            const positionerCenter = positionerRect
              ? positionerRect.left + positionerRect.width / 2
              : 0;

            // Calculate offset to keep popup centered at target
            const offset = targetCenter - positionerCenter;
            popup.style.transform = `translateX(${offset}px)`;

            if (elapsed < duration) {
              requestAnimationFrame(trackPosition);
            } else {
              // Transition complete, set final offset
              popup.style.transform = `translateX(${finalOffset}px)`;
            }
          };

          requestAnimationFrame(trackPosition);
        } else {
          // Normal cursor following within same trigger - instant response
          // (CSS only transitions scale/opacity, not transform, so this is instant)
          popupRef.current.style.transform = `translateX(${finalOffset}px)`;
        }

        prevTriggerCenterRef.current = newTriggerCenterX;
      }
    },
    [],
  );

  const resetCursorX = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.style.transform = "translateX(0px)";
    }
    prevTriggerCenterRef.current = null;
  }, []);

  // Close preview card on route change
  useEffect(() => {
    const handleRouteChangeStart = () => {
      hoverGifHandle.close();
      resetCursorX();
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.events, resetCursorX]);

  return (
    <HoverGifContext.Provider value={{ popupRef, updateCursorX, resetCursorX }}>
      {children}
      <HoverGifPopup popupRef={popupRef} />
    </HoverGifContext.Provider>
  );
}
