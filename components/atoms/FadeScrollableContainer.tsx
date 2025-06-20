import { useCallback, useRef, useState } from "react";
import { cn } from "@lib/utils/cn";

interface FadeScrollableContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  background: string;
}

const FadeScrollableContainer = ({
  background,
  className,
  children,
}: FadeScrollableContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(true);
  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const container = ref.current;
    const scrollable = container.scrollWidth - container.offsetWidth;
    if (container.scrollLeft == 0) {
      setShowStart(false);
      setShowEnd(true);
    } else if (container.scrollLeft >= scrollable - 1) {
      setShowStart(true);
      setShowEnd(false);
    } else {
      setShowStart(true);
      setShowEnd(true);
    }
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {showStart && (
        <span
          className="absolute top-0 left-0 block h-full w-4 bg-linear-to-r from-inherit to-transparent"
          style={
            {
              "--tw-gradient-from": background,
            } as React.CSSProperties
          }
        ></span>
      )}
      {showEnd && (
        <span
          className="absolute top-0 right-0 block h-full w-4 bg-linear-to-r from-transparent to-inherit"
          style={
            {
              "--tw-gradient-to": background,
            } as React.CSSProperties
          }
        ></span>
      )}
      <div
        className="scrollbar-hidden overflow-y-scroll"
        ref={ref}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default FadeScrollableContainer;
