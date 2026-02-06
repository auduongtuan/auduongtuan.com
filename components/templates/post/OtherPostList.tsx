import IconButton from "@atoms/IconButton";
import { Post } from "@lib/notion";
import { cn } from "@lib/utils/cn";
import MiniPostCard from "@molecules/post/MiniPostCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSnapCarousel } from "react-snap-carousel";

const POSTS_PER_PAGE = 6;

const useChevronVisibility = (
  parentRef: React.RefObject<HTMLDivElement | null>,
  leftRef: React.RefObject<HTMLButtonElement | null>,
  rightRef: React.RefObject<HTMLButtonElement | null>,
) => {
  const [inViewportLeft, setInViewportLeft] = useState(false);
  const [inViewportRight, setInViewportRight] = useState(false);
  const SAFE_AREA = 8;

  useEffect(() => {
    const checkViewportPosition = () => {
      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let buttonWidth = 40; // default fallback
        if (leftRef.current) {
          buttonWidth = leftRef.current.getBoundingClientRect().width;
        }

        let spacing = 64; // default fallback
        if (leftRef.current) {
          const transform = getComputedStyle(leftRef.current).transform;
          const match = transform.match(/translateX\(([^)]+)\)/);
          if (match) {
            spacing = Math.abs(parseFloat(match[1]));
          }
        }

        // Calculate left chevron position
        const leftChevronPosition = parentRect.left - spacing - buttonWidth;
        const shouldShowLeft = leftChevronPosition >= SAFE_AREA;

        setInViewportLeft(shouldShowLeft);

        // Calculate right chevron position
        const rightChevronPosition = parentRect.right + spacing + buttonWidth;
        const shouldShowRight =
          rightChevronPosition <= viewportWidth - SAFE_AREA;

        setInViewportRight(shouldShowRight);
      }
    };

    checkViewportPosition();

    window.addEventListener("resize", checkViewportPosition);
    window.addEventListener("orientationchange", checkViewportPosition);

    return () => {
      window.removeEventListener("resize", checkViewportPosition);
      window.removeEventListener("orientationchange", checkViewportPosition);
    };
  }, [parentRef, leftRef, rightRef]);

  return { inViewportLeft, inViewportRight };
};

const OtherPostList = ({ posts, post }: { post: Post; posts: Post[] }) => {
  const filteredPosts = posts.filter((postItem) => postItem.slug != post.slug);
  const parentRef = useRef<HTMLDivElement>(null);
  const leftChevronRef = useRef<HTMLButtonElement>(null);
  const rightChevronRef = useRef<HTMLButtonElement>(null);

  const pages = useMemo(
    () =>
      filteredPosts.reduce((acc: Post[][], _, index) => {
        if (index % POSTS_PER_PAGE === 0) {
          acc.push(filteredPosts.slice(index, index + POSTS_PER_PAGE));
        }
        return acc;
      }, []),
    [filteredPosts],
  );

  const {
    scrollRef,
    activePageIndex,
    prev,
    next,
    goTo,
    pages: carouselPages,
  } = useSnapCarousel();

  const {
    inViewportLeft: isLeftInViewport,
    inViewportRight: isRightInViewport,
  } = useChevronVisibility(parentRef, leftChevronRef, rightChevronRef);

  return (
    <>
      <h3 className="subheading">Other posts</h3>
      <div className="relative mt-6 md:mt-2" ref={parentRef}>
        <IconButton
          ref={leftChevronRef}
          onClick={() => prev()}
          className={cn(
            "absolute top-1/2 left-0 -translate-x-16 -translate-y-1/2",
            !isLeftInViewport && "hidden",
            activePageIndex === 0 && "pointer-events-none invisible opacity-0",
          )}
        >
          <FiChevronLeft />
        </IconButton>
        <div
          className="scrollbar-hidden -mx-[calc(min(var(--section-horizontal-padding),1rem))] flex snap-x snap-mandatory overflow-x-auto *:w-full *:shrink-0 *:grow-0"
          ref={scrollRef}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="group grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-0"
              style={{ scrollSnapAlign: "start" }}
            >
              {page.map((postItem) => (
                <div
                  className="border-divider flex flex-col md:py-4 md:odd:border-r md:odd:pr-6 md:even:pl-6"
                  key={postItem.id}
                >
                  <MiniPostCard post={postItem} />
                </div>
              ))}
            </div>
          ))}
        </div>
        {carouselPages.length > 1 && (
          <div className="mt-3 flex items-center justify-center">
            {carouselPages.map((_, i) => (
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
        )}
        <IconButton
          ref={rightChevronRef}
          onClick={() => next()}
          className={cn(
            "absolute top-1/2 right-0 translate-x-16 -translate-y-1/2",
            !isRightInViewport && "hidden",
            activePageIndex === carouselPages.length - 1 &&
              "pointer-events-none invisible opacity-0",
          )}
        >
          <FiChevronRight />
        </IconButton>
      </div>
    </>
  );
};

export default OtherPostList;
