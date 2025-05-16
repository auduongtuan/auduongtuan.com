import { useRef, useState } from "react";
import { Direction, DisplayPhoto } from "./types";
import { SWIPE_COMPLETE_THRESHOLD, SWIPE_START_THRESHOLD } from "./constants";
import { MouseEventHandler, TouchEventHandler } from "react";

export function usePhotoCardSwipe({
  index,
  cardRef,
  onSwipe,
  revertNextCardReady,
  nextCardReady,
  photo,
}: {
  index: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSwipe: (direction: Direction, photo: DisplayPhoto) => void;
  revertNextCardReady: () => void;
  nextCardReady: () => void;
  photo: DisplayPhoto;
}) {
  const isActive = index == 0;
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // For double tap detection
  const lastTapTime = useRef<number>(0);
  const tapCount = useRef<number>(0);
  const TAP_DELAY = 300; // ms between taps to be considered a double tap

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
    if (
      Math.abs(deltaX) > SWIPE_COMPLETE_THRESHOLD ||
      Math.abs(deltaY) > SWIPE_COMPLETE_THRESHOLD
    ) {
      nextCardReady();
    }

    if (cardRef.current) {
      // Apply movement - prioritize vertical movement if it's stronger
      if (absY > absX) {
        if (deltaY < -SWIPE_START_THRESHOLD) {
          // Moving upward (TOP)
          cardRef.current.style.transform = `translateY(${deltaY}px) scale(${1 - Math.abs(deltaY) * 0.0005})`;
          setSwipeDirection(Direction.TOP);
        } else if (deltaY > SWIPE_START_THRESHOLD) {
          // Moving downward (BOTTOM)
          cardRef.current.style.transform = `translateY(${deltaY}px) scale(${1 - Math.abs(deltaY) * 0.0005})`;
          setSwipeDirection(Direction.BOTTOM);
        } else {
          setSwipeDirection(null);
        }
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

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    setIsDragging(false);

    // Check for double tap
    const currentTime = new Date().getTime();
    const tapTimeDiff = currentTime - lastTapTime.current;

    if (tapTimeDiff < TAP_DELAY && tapCount.current === 1) {
      // This is a double tap
      tapCount.current = 0;
      // Use the dedicated DOUBLE_TAP direction for 😮 (Wow) reaction
      triggerSwipe(Direction.DOUBLE_TAP);
      return;
    }

    // This is the first tap
    tapCount.current = 1;
    lastTapTime.current = currentTime;

    // Reset tap count after delay
    setTimeout(() => {
      if (tapCount.current === 1) {
        tapCount.current = 0;
      }
    }, TAP_DELAY);

    completeSwipe();
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // Check for double click (same logic as double tap)
    const currentTime = new Date().getTime();
    const clickTimeDiff = currentTime - lastTapTime.current;

    // Only consider it a double click if there was minimal movement (not a drag)
    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const totalMovement = Math.abs(deltaX) + Math.abs(deltaY);

    if (
      clickTimeDiff < TAP_DELAY &&
      tapCount.current === 1 &&
      totalMovement < 10
    ) {
      // This is a double click
      tapCount.current = 0;
      // Use the dedicated DOUBLE_TAP direction for 😮 (Wow) reaction
      triggerSwipe(Direction.DOUBLE_TAP);
      return;
    }

    // This is the first click
    tapCount.current = 1;
    lastTapTime.current = currentTime;

    // Reset click count after delay
    setTimeout(() => {
      if (tapCount.current === 1) {
        tapCount.current = 0;
      }
    }, TAP_DELAY);

    completeSwipe();
  };

  const completeSwipe = () => {
    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if the swipe was decisive enough and in which direction
    if (absY > absX) {
      if (deltaY < -SWIPE_COMPLETE_THRESHOLD) {
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
      } else if (deltaY > SWIPE_COMPLETE_THRESHOLD) {
        // Swiped BOTTOM
        if (cardRef.current) {
          cardRef.current.style.transition =
            "transform 0.4s ease, opacity 0.4s ease";
          cardRef.current.style.transform = `translateY(${window.innerHeight}px) scale(0.8)`;
          cardRef.current.style.opacity = "0";

          setTimeout(() => {
            onSwipe(Direction.BOTTOM, photo);
          }, 150);
        }
      } else {
        // Not enough vertical movement, return to center
        if (cardRef.current) {
          cardRef.current.style.transition = "transform 0.3s ease";
          cardRef.current.style.transform = "translateY(0) scale(1)";
          if (revertNextCardReady) {
            revertNextCardReady();
          }
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.style.transition = "";
              setSwipeDirection(null);
            }
          }, 300);
        }
        return; // Exit early
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
        // Reset horizontal movement
        cardRef.current.style.transform = "translateX(0) rotate(0deg)";

        if (revertNextCardReady) {
          revertNextCardReady();
        }
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = "";
            setSwipeDirection(null);
          }
        }, 300);
      }
    }
  };

  /**
   * Programmatically trigger a swipe in a specific direction
   */
  const triggerSwipe = (direction: Direction) => {
    if (!cardRef.current) return;

    // Notify parent to prepare next card
    nextCardReady();

    // Update swipe direction state
    setSwipeDirection(direction);

    // Apply appropriate transform based on direction
    if (direction === Direction.TOP) {
      cardRef.current.style.transition =
        "transform 4s ease-in, opacity 0.8s ease-in";
      cardRef.current.style.transform = `translateY(-${window.innerHeight}px) scale(0.8)`;
      cardRef.current.style.opacity = "0";
    } else if (direction === Direction.BOTTOM) {
      cardRef.current.style.transition =
        "transform 4s ease-in, opacity 0.8s ease-in";
      cardRef.current.style.transform = `translateY(${window.innerHeight}px) scale(0.8)`;
      cardRef.current.style.opacity = "0";
    } else {
      const endX =
        direction === Direction.RIGHT
          ? window.innerWidth + 200
          : -window.innerWidth - 200;
      cardRef.current.style.transition =
        "transform 4s ease-in, opacity 0.8s ease-in";
      cardRef.current.style.transform = `translateX(${endX}px) rotate(${direction === Direction.RIGHT ? 20 : -20}deg)`;
      cardRef.current.style.opacity = "0";
    }

    // Trigger the swipe callback after a short delay
    setTimeout(() => {
      onSwipe(direction, photo);
    }, 150);
  };

  return {
    handleTouchStart,
    handleMouseDown,
    handleTouchMove,
    handleMouseMove,
    handleTouchEnd,
    handleMouseUp,
    completeSwipe,
    isDragging,
    swipeDirection,
    triggerSwipe,
  };
}
