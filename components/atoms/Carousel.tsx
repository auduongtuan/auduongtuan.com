import { Children, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import IconButton from "./IconButton";
import { useSnapCarousel } from "react-snap-carousel";
import { cn } from "@lib/utils/cn";
import Caption from "./Caption";
import useProjectStore from "@store/useProjectStore";
import { useCompare } from "@hooks";
import { event } from "@lib/gtag";

const Carousel = ({
  children,
  caption,
  blockId,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
  blockId?: string;
}) => {
  const {
    goTo,
    activePageIndex,
    pages,
    scrollRef,
    snapPointIndexes,
    prev,
    next,
  } = useSnapCarousel();
  const [isSSR, setIsSSR] = useState(true);
  const { project } = useProjectStore();
  const hasActivePageIndexChanged = useCompare(activePageIndex);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  useEffect(() => {
    if (isSSR) return;
    if (!hasActivePageIndexChanged) return;
    event({
      action: "carousel_page_changed",
      category: "project_page",
      label: project?.title!,
      page_index: activePageIndex,
      block_id: blockId,
    });
  }, [project, blockId, activePageIndex, hasActivePageIndexChanged, isSSR]);
  return (
    <figure>
      <div className="relative">
        <IconButton
          onClick={() => prev()}
          className={cn(
            "absolute top-1/2 left-0 hidden -translate-x-16 -translate-y-1/2 md:flex",
            activePageIndex === 0 && "pointer-events-none invisible opacity-0",
          )}
        >
          <FiChevronLeft />
        </IconButton>
        {/* <div className="overflow-x-auto"> */}
        <div
          className="scrollbar-hidden flex snap-x snap-mandatory gap-2 overflow-x-auto transition-all duration-150 *:w-full *:shrink-0 *:grow-0"
          ref={scrollRef}
        >
          {Children.map(children, (child, i) => {
            return (
              <div
                key={i}
                className="shrink-0"
                style={
                  isSSR
                    ? { scrollSnapAlign: "start" }
                    : {
                        scrollSnapAlign: snapPointIndexes.has(i) ? "start" : "",
                      }
                }
              >
                {child}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-center">
          {pages.map((_, i) => (
            <button
              key={i}
              className={cn(
                "bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-pressed mx-2 block size-3 rounded-full font-bold text-transparent",
                activePageIndex === i && "bg-button-secondary-activated",
              )}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {/* </div> */}
        <IconButton
          onClick={() => next()}
          className={cn(
            "absolute top-1/2 right-0 hidden translate-x-16 -translate-y-1/2 md:flex",
            activePageIndex === pages.length - 1 &&
              "pointer-events-none invisible opacity-0",
          )}
        >
          <FiChevronRight />
        </IconButton>
      </div>
      {caption && <Caption as="figcaption">{caption}</Caption>}
    </figure>
  );
};

export default Carousel;
