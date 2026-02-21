import { useCallback, useRef, useState } from "react";
import { cn } from "@lib/utils/cn";

type FadeScrollableContainerProps = React.ComponentPropsWithRef<"div">;

const FADE_SIZE = "3rem";

const getMaskImage = (showStart: boolean, showEnd: boolean): string => {
  if (showStart && showEnd) {
    return `linear-gradient(to right, transparent, black ${FADE_SIZE}, black calc(100% - ${FADE_SIZE}), transparent)`;
  }
  if (showStart) {
    return `linear-gradient(to right, transparent, black ${FADE_SIZE})`;
  }
  if (showEnd) {
    return `linear-gradient(to right, black calc(100% - ${FADE_SIZE}), transparent)`;
  }
  return "none";
};

const FadeScrollableContainer = ({
  className,
  children,
  ...props
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
    <div
      className={cn("w-full", className)}
      style={{ maskImage: getMaskImage(showStart, showEnd) }}
      {...props}
    >
      <div
        className="scrollbar-hidden overflow-x-scroll"
        ref={ref}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  );
};

export default FadeScrollableContainer;
