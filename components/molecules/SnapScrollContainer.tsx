import IconButton from "@atoms/IconButton";
import { useResizeObserver } from "@hooks/useResizeObserver";
import { trackEvent } from "@lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export interface SnapScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  trackingEvent?: string;
}

export default function SnapScrollContainer({
  children,
  className = "",
  trackingEvent = "scroll_list",
}: SnapScrollContainerProps) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement> | HTMLDivElement) => {
      const target = e instanceof HTMLDivElement ? e : e.currentTarget;
      setShowLeft(target.scrollLeft > 0);
      setShowRight(target.scrollLeft < target.scrollWidth - target.clientWidth);
    },
    [],
  );

  useEffect(() => {
    if (containerRef.current) handleScroll(containerRef.current);
  }, [containerRef]);

  const size = useResizeObserver(containerRef);

  const next = useCallback(() => {
    if (containerRef.current) {
      const firstCard = firstCardRef.current;
      if (!firstCard) return;
      trackEvent({
        event: trackingEvent,
        content: "next_button",
        page: window.location.pathname,
      });
      const cardWidth = firstCard?.getBoundingClientRect().width || 0 + 24;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + cardWidth,
        behavior: "smooth",
      });
    }
  }, [containerRef, size, trackingEvent]);

  const prev = useCallback(() => {
    if (containerRef.current) {
      const firstCard = firstCardRef.current;
      if (!firstCard) return;
      trackEvent({
        event: trackingEvent,
        content: "prev_button",
        page: window.location.pathname,
      });
      const cardWidth = firstCard?.getBoundingClientRect().width || 0 + 24;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft - cardWidth,
        behavior: "smooth",
      });
    }
  }, [containerRef, size, trackingEvent]);

  return (
    <div className="relative">
      <div
        className={`scrollbar-hidden max-w-full snap-x overflow-x-scroll ${className}`}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className="flex">
          <div className="flex shrink-0 gap-6">
            {Array.isArray(children)
              ? children.map((child, i) => (
                  <div
                    key={i}
                    className="flex snap-start last:pr-[calc(var(--half-margin)*2)]"
                    data-card-index={i}
                    ref={i === 0 ? firstCardRef : null}
                  >
                    {child}
                  </div>
                ))
              : children}
          </div>
        </div>
      </div>
      <div
        className="absolute top-1/2 left-(--half-margin) hidden -translate-y-1/2 transition-opacity duration-100 ease-in-out xl:block"
        style={{ opacity: showLeft ? 1 : 0 }}
      >
        <IconButton
          size="large"
          onClick={prev}
          className="-ml-15"
          variant="overlay"
        >
          <FiArrowLeft />
        </IconButton>
      </div>
      <div
        className="absolute top-1/2 right-(--half-margin) hidden -translate-y-1/2 transition-opacity duration-100 ease-in-out xl:block"
        style={{ opacity: showRight ? 1 : 0 }}
      >
        <IconButton
          size="large"
          onClick={next}
          className="-mr-15"
          variant="overlay"
        >
          <FiArrowRight />
        </IconButton>
      </div>
    </div>
  );
}