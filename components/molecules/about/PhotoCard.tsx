import { Direction, Photo } from "./types";
import { MouseEventHandler, TouchEventHandler, useRef, useState } from "react";
import CustomImage from "@atoms/CustomImage";
import Reaction from "@molecules/comment/Reaction";

interface PhotoCardProps {
  photo: Photo;
  onSwipe?: (direction: Direction, photo: Photo) => void;
  isActive?: boolean;
  nextCardReady?: () => void;
  index?: number;
  isNext?: boolean;
  ref?: React.RefObject<HTMLDivElement> | ((node: HTMLDivElement) => void);
}

export const PhotoCard = ({
  photo,
  onSwipe = () => {},
  isActive = false,
  nextCardReady = () => {},
  index = 0,
  isNext = false,
  ref,
}: PhotoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const combinedRef = (node: HTMLDivElement) => {
    cardRef.current = node;
    if (ref) {
      if (typeof ref === "function") {
        (ref as React.RefCallback<HTMLDivElement>)(node);
      } else {
        ref.current = node;
      }
    }
  };
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);
  const SWIPE_COMPLETE_THRESHOLD = 100; // how far user needs to swipe to trigger action
  // const SWIPE_THRESHOLD = 20; // original AI suggest
  const SWIPE_START_THRESHOLD = 2;
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Track swipe progress
  const swipeProgress = useRef<number>(0);

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = startX.current;
    currentY.current = startY.current;
    setIsDragging(true);
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    e.preventDefault(); // Prevent text selection
    startX.current = e.clientX;
    startY.current = e.clientY;
    currentX.current = startX.current;
    currentY.current = startY.current;
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    updateCardPosition(touchX, touchY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault(); // Prevent text selection during drag
    updateCardPosition(e.clientX, e.clientY);
  };

  const updateCardPosition = (
    currentClientX: number,
    currentClientY: number,
  ) => {
    const deltaX = currentClientX - startX.current;
    const deltaY = currentClientY - startY.current;
    currentX.current = currentClientX;
    currentY.current = currentClientY;

    // Determine primary direction of movement
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate swipe progress as a percentage of threshold
    swipeProgress.current = Math.max(absX, absY) / SWIPE_COMPLETE_THRESHOLD;

    // Notify parent to prepare next card as soon as movement starts
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      nextCardReady();
    }

    if (cardRef.current) {
      // Apply movement - prioritize vertical movement if it's stronger
      if (
        absY > absX &&
        // deltaY < -20 // original AI suggest
        deltaY < -SWIPE_START_THRESHOLD
      ) {
        // Moving upward (TOP)
        cardRef.current.style.transform = `translateY(${deltaY}px) scale(${1 - Math.abs(deltaY) * 0.0005})`;
        setSwipeDirection(Direction.TOP);
      } else if (absX > SWIPE_START_THRESHOLD) {
        // Moving horizontally (LEFT/RIGHT)
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;

        if (deltaX > SWIPE_START_THRESHOLD) {
          setSwipeDirection(Direction.RIGHT);
        } else if (deltaX < -SWIPE_START_THRESHOLD) {
          setSwipeDirection(Direction.LEFT);
        } else {
          setSwipeDirection(null);
        }
      } else {
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = () => {
    if (!isActive) return;
    setIsDragging(false);
    completeSwipe();
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    completeSwipe();
  };

  const completeSwipe = () => {
    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if the swipe was decisive enough and in which direction
    if (absY > absX && deltaY < -SWIPE_COMPLETE_THRESHOLD) {
      // Swiped TOP
      if (cardRef.current) {
        cardRef.current.style.transition =
          "transform 0.4s ease, opacity 0.4s ease";
        cardRef.current.style.transform = `translateY(-${window.innerHeight}px) scale(0.8)`;
        cardRef.current.style.opacity = "0";

        setTimeout(() => {
          onSwipe(Direction.TOP, photo);
        }, 150);
      }
    } else if (absX >= SWIPE_COMPLETE_THRESHOLD) {
      // Swiped LEFT or RIGHT
      const direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;

      // Animate card flying off screen
      if (cardRef.current) {
        const endX =
          direction === Direction.RIGHT
            ? window.innerWidth + 200
            : -window.innerWidth - 200;
        cardRef.current.style.transition =
          "transform 0.4s ease, opacity 0.4s ease";
        cardRef.current.style.transform = `translateX(${endX}px) rotate(${deltaX * 0.05}deg)`;
        cardRef.current.style.opacity = "0";

        // Trigger the swipe callback sooner for smoother transitions
        setTimeout(() => {
          onSwipe(direction, photo);
        }, 150); // Reduced from 300ms for faster response
      }
    } else {
      // Return card to center
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.3s ease";
        cardRef.current.style.transform = "translateX(0) rotate(0deg)";
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = "";
            setSwipeDirection(null);
          }
        }, 300);
      }
    }
  };

  // Determine card styling based on whether it's active or a stacked card
  const getCardStyle = () => {
    if (isActive) {
      return {
        position: "absolute" as const,
        width: "100%",
        top: 0,
        zIndex: 10,
        transition: isDragging
          ? "none"
          : "transform 0.3s ease, opacity 0.3s ease",
      };
    } else {
      return {
        position: "absolute" as const,
        width: "100%",
        top: 0,
        zIndex: 5 - (index || 0),
        transform: `translateY(${10 * (index || 0)}px) scale(${1 - 0.05 * (index || 0)})`,
        opacity: (index || 0) <= 3 ? 1 : 0,
        transition: isNext
          ? "transform 0.25s ease, opacity 0.25s ease, scale 0.25s ease"
          : "transform 0.3s ease, opacity 0.3s ease",
      };
    }
  };

  return (
    <div
      data-card-type={isActive ? "active" : "stack"}
      ref={combinedRef}
      className={`border-divider flex flex-col items-start justify-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${isActive ? "cursor-grab active:cursor-grabbing" : ""} select-none`}
      style={getCardStyle()}
      onTouchStart={isActive ? handleTouchStart : undefined}
      onTouchMove={isActive ? handleTouchMove : undefined}
      onTouchEnd={isActive ? handleTouchEnd : undefined}
      onMouseDown={isActive ? handleMouseDown : undefined}
    >
      {/* Like/Nope/Super Like Overlay - Only shown on active card when swiping */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="duraction-100 bg-opacity-70 rotate-12 rounded-xl border-4 border-green-500 bg-white px-6 py-2 text-3xl font-bold text-green-500 transition-opacity"
            style={{
              opacity: swipeDirection === Direction.RIGHT ? 1 : 0,
            }}
          >
            💖 LOVE
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="duraction-100 bg-opacity-70 -rotate-12 rounded-xl border-4 border-red-500 bg-white px-6 py-2 text-3xl font-bold text-red-500 transition-opacity"
            style={{
              opacity: swipeDirection === Direction.LEFT ? 1 : 0,
            }}
          >
            🤨 EWW
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="duraction-100 bg-opacity-70 rounded-xl border-4 border-blue-500 bg-white px-6 py-2 text-3xl font-bold text-blue-500 transition-opacity"
            style={{
              opacity: swipeDirection === Direction.TOP ? 1 : 0,
            }}
          >
            💅 SLAY
          </div>
        </div>
      )}

      <CustomImage
        src={photo.image || "/portrait.jpg"}
        alt={`${photo.username}'s portrait`}
        width={1920}
        height={2556}
        className="w-full self-stretch rounded-md object-cover"
      />
      <div className="w-full font-mono">
        <p className="font-semibold">{photo.username || "@auduongtuan"}</p>
        <p className="mt-1 text-xs whitespace-pre-line">
          {photo.bio ||
            "Lập xuân đua nở hoa đào 🌸\nTim cậu liệu có ai vào hay chưa? 😳"}
        </p>
      </div>
      <Reaction page="/about#avatar" size="small" className="inline-flex" />
    </div>
  );
};
