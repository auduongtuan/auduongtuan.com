"use client";
import { useAnimationsFinished, useBreakpoint, useWindowSize } from "@hooks";
import { cn } from "@lib/utils/cn";
import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  calculateCardStackHeight,
  getStackCardTransform,
  swipeAction,
} from "./functions";
import { InstructionOverlay } from "./InstructionOverlay";
import { PhotoCard } from "./PhotoCard";
import { PHOTOS } from "./constants";
import { Direction, Photo } from "./types";
import { usePhotoStore } from "./photoStore";
import { calculateGridLayoutHeight } from "./functions";
import { shuffleArray } from "@lib/utils/common";

export default function PhotoCards() {
  // For infinite scrolling, we maintain a queue of photos that's always being replenished
  const {
    isExpanded,
    isPreparingNextCard,
    setIsPreparingNextCard,
    setIsExpanding,
  } = usePhotoStore();
  const [displayPhotos, setDisplayPhotos] = useState<Photo[]>([]);

  // Store viewed cards
  const [viewedPhotos, setViewedPhotos] = useState<Photo[]>([]);

  const randomSortedPhotos = useMemo(
    () =>
      shuffleArray(
        PHOTOS.map((photo) => ({
          ...photo,
          image: Array.isArray(photo.image)
            ? photo.image[Math.floor(Math.random() * photo.image.length)]
            : photo.image,
        })),
      ),
    [],
  );

  // Instead of using currentIndex, we'll shift the array of displayPhotos
  useEffect(() => {
    // Initialize with double the photos to ensure smooth looping
    const doubledPhotos = [
      ...randomSortedPhotos,
      ...randomSortedPhotos.map((photo) => ({
        ...photo,
        id: photo.id + randomSortedPhotos.length, // Assign new IDs to avoid key conflicts
      })),
    ];
    setDisplayPhotos(doubledPhotos);
  }, [randomSortedPhotos]);

  // Handle when the active card is being swiped significantly
  const handleNextCardReady = () => {
    if (!isPreparingNextCard) {
      setIsPreparingNextCard(true);

      // Force the stack to update immediately
      const stackCards = document.querySelectorAll("[data-card-type='stack']");
      stackCards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transform = getStackCardTransform(index);
      });
    }
  };

  const revertNextCardReady = () => {
    setIsPreparingNextCard(false);

    // Force the stack to update immediately
    const stackCards = document.querySelectorAll("[data-card-type='stack']");
    stackCards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      cardElement.style.transform = getStackCardTransform(index + 1);
    });
  };

  const handleSwipe = (direction: Direction, photo: Photo) => {
    // console.log(`Swiped ${direction} on ${photo.name}`);

    // Add current photo to viewed photos
    const currentPhoto = displayPhotos[0];
    setViewedPhotos((prev) => [
      ...prev,
      { ...currentPhoto, swipeDirection: direction },
    ]);

    // Remove the swiped card and add a new one at the end to maintain the queue
    setDisplayPhotos((prevPhotos) => {
      const shiftedPhotos = [...prevPhotos.slice(1)];

      // Get the photo to add at the end for infinite scrolling
      // We use modulo to cycle through the initial photos
      const nextPhotoIndex = viewedPhotos.length % randomSortedPhotos.length;
      const nextPhoto = {
        ...randomSortedPhotos[nextPhotoIndex],
        id: prevPhotos[prevPhotos.length - 1].id + 1, // Generate unique ID
      };

      // Add the next photo to the end of the queue
      return [...shiftedPhotos, nextPhoto];
    });

    // Reset the preparation state
    setIsPreparingNextCard(false);

    swipeAction(direction, photo);
  };

  // We show at most 4 cards at a time for stack effect
  const visiblePhotos = isExpanded
    ? randomSortedPhotos
    : displayPhotos.slice(0, 4);

  const cardRefs = useRef<Record<number, HTMLDivElement>>({});

  const ref = useRef<HTMLDivElement>(null);

  const animationsFinished = useAnimationsFinished(ref, {
    subtree: true,
  });

  const [originalWidth, setOriginalWidth] = useState<number>(0);

  const { width } = useWindowSize();

  useEffect(() => {
    document.documentElement.style.setProperty("overflow-y", "scroll");
    // setHighestHeight("100vh");

    animationsFinished(() => {
      setIsExpanding(false);
    });
  }, [isExpanded, animationsFinished, setIsExpanding]);

  useLayoutEffect(() => {
    // if (isExpanded) return;
    if (ref.current) {
      setOriginalWidth(ref.current.parentElement?.offsetWidth || 0);
    }
  }, [width]);

  const breakpoint = useBreakpoint();
  const columns = useMemo(() => {
    if (!isExpanded) {
      if (breakpoint === "sm") return 1;
      return 3;
    }
    return breakpoint === "sm"
      ? 1
      : breakpoint === "md" || breakpoint === "lg"
        ? 2
        : 3;
  }, [breakpoint, isExpanded]);

  // Store the calculated height
  const [calculatedHeight, setCalculatedHeight] = useState(0);

  // Calculate height with a delay using requestAnimationFrame
  useEffect(() => {
    const cards = Object.values(cardRefs.current);

    // Use two frames to ensure DOM has updated
    function calculateHeight() {
      let height = 0;
      if (isExpanded) {
        height = calculateGridLayoutHeight(cards, {
          columns: columns,
          gapY: 32,
        });
      } else {
        height = calculateCardStackHeight(cards);
      }
      setCalculatedHeight(height);
    }
    requestAnimationFrame(() => {
      calculateHeight();
    });
    // re-calculate height when animations finished
    animationsFinished(() => {
      calculateHeight();
    });
    // }
  }, [isExpanded, visiblePhotos.length, columns, width]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2">
      <div
        className={cn("relative w-full")}
        style={
          {
            minHeight: `${calculatedHeight}px`,
            "--original-width":
              breakpoint === "sm"
                ? "var(--container-width)"
                : `calc((var(--container-width) + var(--gap-x))/12 * 5 - var(--gap-x))`,
            "--columns": `${columns}`,
          } as CSSProperties
        }
        ref={ref}
      >
        {/* Render all cards using the single Card component */}
        {visiblePhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isActive={index === 0}
            onSwipe={index === 0 ? handleSwipe : undefined}
            nextCardReady={index === 0 ? handleNextCardReady : undefined}
            revertNextCardReady={index === 0 ? revertNextCardReady : undefined}
            index={index}
            isNext={index === 1 && isPreparingNextCard}
            ref={(el) => {
              if (el) {
                cardRefs.current = {
                  ...cardRefs.current,
                  [index]: el,
                };
              }
            }}
            className={cn(
              "w-[calc(((var(--container-width)+var(--gap-x))*1)/var(--columns)-var(--gap-x))] break-inside-avoid",
            )}
          />
        ))}
        <InstructionOverlay />
      </div>
    </div>
  );
}
