"use client";
import { useAnimationsFinished, useWindowSize } from "@hooks";
import { cn } from "@lib/utils/cn";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import {
  calculateCardStackHeight,
  getStackCardTransform,
  swipeAction,
} from "./functions";
import { InstructionOverlay, useInstructionStore } from "./InstructionOverlay";
import { PhotoCard } from "./PhotoCard";
import { PHOTOS } from "./constants";
import { Direction, Photo } from "./types";
import { usePhotoStore } from "./photoStore";
import { calculateGridLayoutHeight } from "./functions";

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

  // Get instruction state from zustand store
  const { hasSeenInstruction, markInstructionAsSeen } = useInstructionStore();
  const [showInstruction, setShowInstruction] = useState(false);

  // Instead of using currentIndex, we'll shift the array of displayPhotos
  useEffect(() => {
    // Initialize with double the photos to ensure smooth looping
    const doubledPhotos = [
      ...PHOTOS,
      ...PHOTOS.map((photo) => ({
        ...photo,
        id: photo.id + PHOTOS.length, // Assign new IDs to avoid key conflicts
      })),
    ];
    setDisplayPhotos(doubledPhotos);

    // Check if we should show the instruction overlay
    if (!hasSeenInstruction) {
      setShowInstruction(true);
    }
  }, [hasSeenInstruction]);

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
      const nextPhotoIndex = viewedPhotos.length % PHOTOS.length;
      const nextPhoto = {
        ...PHOTOS[nextPhotoIndex],
        id: prevPhotos[prevPhotos.length - 1].id + 1, // Generate unique ID
      };

      // Add the next photo to the end of the queue
      return [...shiftedPhotos, nextPhoto];
    });

    // Reset the preparation state
    setIsPreparingNextCard(false);

    swipeAction(direction, photo);
  };

  // Handle closing the instruction overlay
  const handleCloseInstruction = () => {
    setShowInstruction(false);
    markInstructionAsSeen();
  };

  // We show at most 4 cards at a time for stack effect
  const visiblePhotos = isExpanded ? PHOTOS : displayPhotos.slice(0, 4);

  const cardRefs = useRef<Record<number, HTMLDivElement>>({});

  const ref = useRef<HTMLDivElement>(null);

  const animationsFinished = useAnimationsFinished(ref, {
    subtree: true,
  });

  const [highestHeight, setHighestHeight] = useState<string>("0");
  const [originalWidth, setOriginalWidth] = useState<number>(0);

  const { width } = useWindowSize();

  const calculateHighestHeight = useCallback(() => {
    const cards = Object.values(cardRefs.current);
    if (isExpanded)
      return calculateGridLayoutHeight(cards, {
        columns: 3,
        gapY: 32,
      });
    return calculateCardStackHeight(cards);
  }, [isExpanded]);

  useEffect(() => {
    document.documentElement.style.setProperty("overflow-y", "scroll");
    // setHighestHeight("100vh");
    setHighestHeight(calculateHighestHeight() + "px");

    animationsFinished(() => {
      setIsExpanding(false);
    });
  }, [isExpanded]);

  useEffect(() => {
    setHighestHeight(calculateHighestHeight() + "px");
  }, [cardRefs.current]);

  useEffect(() => {
    if (isExpanded) return;
    if (ref.current) {
      setOriginalWidth(ref.current.offsetWidth);
    }
  }, [ref, width]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2">
      <div
        className={cn("relative w-full")}
        style={
          {
            minHeight: `${highestHeight}`,
            "--original-width": `${originalWidth}px`,
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
              "w-[calc(((var(--container-width)+var(--gap-x))*1)/3-var(--gap-x))] break-inside-avoid",
            )}
          />
        ))}
        {/* Instruction Overlay */}
        {showInstruction && (
          <InstructionOverlay onClose={handleCloseInstruction} />
        )}
      </div>
      {/* <Button onClick={() => setIsExpanded((prev) => !prev)}>Show</Button> */}
    </div>
  );
}
