import { Children, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import IconButton from "./IconButton";
import { useSnapCarousel } from "react-snap-carousel";
import { twMerge } from "tailwind-merge";
import Caption from "./Caption";

const Carousel = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
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
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <>
      <div className="relative">
        <IconButton
          onClick={() => prev()}
          className={twMerge(
            "hidden md:flex absolute left-0 -translate-x-16 -translate-y-1/2 top-1/2 ",
            activePageIndex === 0 && "opacity-0 pointer-events-none invisible"
          )}
        >
          <FiChevronLeft />
        </IconButton>
        {/* <div className="overflow-x-auto"> */}
        <div
          className="scrollbar-hidden snap-mandatory gap-2 snap-x overflow-x-auto transition-all duration-150 flex [&>*]:w-full [&>*]:grow-0 [&>*]:shrink-0"
          ref={scrollRef}
        >
          {Children.map(children, (child, i) => {
            return (
              <div
                key={i}
                className="flex-shrink-0"
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
        <div className="flex items-center justify-center mt-3">
          {pages.map((_, i) => (
            <button
              key={i}
              className={twMerge(
                "size-3 rounded-full mx-2 font-bold text-transparent text-white bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-pressed text-[0] block",
                activePageIndex === i && "bg-button-secondary-activated"
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
          className={twMerge(
            "hidden md:flex absolute right-0 translate-x-16 -translate-y-1/2 top-1/2 ",
            activePageIndex === pages.length - 1 &&
              "opacity-0 pointer-events-none invisible"
          )}
        >
          <FiChevronRight />
        </IconButton>
      </div>
      {caption && <Caption>{caption}</Caption>}
    </>
  );
};

export default Carousel;
