"use client";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useStableCallback } from "@base-ui/utils/useStableCallback";

export function useAnimationsFinished(
  ref: React.RefObject<HTMLElement | null>,
  {
    waitForNextTick = false,
    subtree = false,
  }: {
    waitForNextTick?: boolean;
    subtree?: boolean;
  },
) {
  const frameRef = useRef(-1);
  const timeoutRef = useRef(-1);

  const cancelTasks = useStableCallback(() => {
    cancelAnimationFrame(frameRef.current);
    clearTimeout(timeoutRef.current);
  });

  useEffect(() => cancelTasks, [cancelTasks]);

  return useStableCallback((fnToExecute: () => void) => {
    cancelTasks();

    const element = ref.current;

    if (!element) {
      return;
    }

    if (typeof element.getAnimations !== "function") {
      fnToExecute();
    } else {
      frameRef.current = requestAnimationFrame(() => {
        function exec() {
          if (!element) {
            return;
          }

          Promise.allSettled(
            element
              .getAnimations({
                subtree,
              })
              .map((anim) => anim.finished),
          ).then(() => {
            // Synchronously flush the unmounting of the component so that the browser doesn't
            // paint: https://github.com/mui/base-ui/issues/979
            flushSync(fnToExecute);
          });
        }

        // `open: true` animations need to wait for the next tick to be detected
        if (waitForNextTick) {
          timeoutRef.current = window.setTimeout(exec);
        } else {
          exec();
        }
      });
    }
  });
}
