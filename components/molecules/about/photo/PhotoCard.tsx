"use client";
import React from "react";
import { Direction, DisplayPhoto } from "./types";
import { useRef, CSSProperties, useEffect } from "react";
import CustomImage from "@atoms/CustomImage";
import Reaction from "@molecules/comment/Reaction";
import { cn } from "@lib/utils/cn";
import { getStackCardTransform } from "./functions";
import { usePhotoStore } from "./photoStore";
import { ReactionOverlay } from "./ReactionOverlay";
import { usePhotoCardSwipe } from "./usePhotoCardSwipe";
import { useResizeObserver } from "@hooks/useResizeObserver";

interface PhotoCardProps {
  photo: DisplayPhoto;
  onSwipe?: (
    direction: Direction,
    photo: DisplayPhoto,
    options?: { playSound?: boolean },
  ) => void;
  isActive?: boolean;
  nextCardReady?: () => void;
  revertNextCardReady?: () => void;
  index?: number;
  isNext?: boolean;
  ref?: React.RefObject<HTMLDivElement> | ((node: HTMLDivElement) => void);
  className?: string;
}

export const PhotoCard = React.memo(
  ({
    photo,
    onSwipe = () => {},
    isActive = false,
    nextCardReady = () => {},
    revertNextCardReady = () => {},
    index = 0,
    isNext = false,
    ref,
    className,
  }: PhotoCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const suppressNextSwipeSoundRef = useRef(false);
    const { isExpanded, isExpanding } = usePhotoStore();
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

    const {
      isDragging,
      handleTouchStart,
      handleTouchEnd,
      handleTouchMove,
      handleMouseDown,
      swipeDirection,
      triggerSwipe,
    } = usePhotoCardSwipe({
      index,
      cardRef,
      onSwipe: (direction, swipedPhoto) => {
        const playSound = !suppressNextSwipeSoundRef.current;
        suppressNextSwipeSoundRef.current = false;
        onSwipe(direction, swipedPhoto, { playSound });
      },
      revertNextCardReady,
      nextCardReady,
      photo,
    });

    const { width: cardWith } = useResizeObserver(cardRef);

    // Determine card styling based on whether it's active or a stacked card
    const getCardStyle = (): CSSProperties => {
      // style when expand

      if (isExpanded) {
        return {
          position: "absolute",
          zIndex: 10 - (index || 0),
          transform: getStackCardTransform(index),
          transition:
            "width 0.3s ease, left 0.3s ease, top 0.3s ease, transform 0.3s ease, opacity 0.3s ease",
          left: 0,
          top: 0,
          opacity: index < 4 ? 1 : 0,
        } as CSSProperties;
      }
      // hide card when width is not available
      if (!cardWith)
        return {
          visibility: "hidden",
        } as CSSProperties;
      if (isActive) {
        return {
          position: "absolute" as const,
          // width: "100%",
          top: 0,
          left: `calc(var(--original-width) / 2 - (${cardWith}px / 2))`,
          zIndex: 10,
          transition: isDragging
            ? "none"
            : `transform 0.3s ease, opacity 0.3s ease${isExpanding ? ", left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in" : ""}`,
        };
      } else {
        return {
          position: "absolute" as const,
          // width: "100%",
          top: 0,
          left: `calc(var(--original-width) / 2 - (${cardWith}px / 2))`,
          zIndex: 5 - (index || 0),
          transform: getStackCardTransform(index),
          opacity: (index || 0) <= 3 ? 1 : 0,
          transition: isNext
            ? "transform 0.25s ease, opacity 0.25s ease, scale 0.25s ease"
            : `transform 0.3s ease, opacity 0.3s ease${isExpanding ? ", left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in" : ""}`,
        };
      }
    };

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
      if (!isExpanded) {
        Object.assign(card.style, getCardStyle());
      }
    }, [isExpanded, getCardStyle]);

    return (
      <div
        data-card-type={isActive ? "active" : "stack"}
        ref={combinedRef}
        className={cn(
          `border-divider bg-surface flex flex-col items-center justify-center gap-3 rounded-lg border px-2 pt-2 pb-3 shadow-lg md:px-3 md:pt-3 md:pb-4`,

          "select-none",
          className,
        )}
        style={getCardStyle()}
      >
        <ReactionOverlay isActive={isActive} swipeDirection={swipeDirection} />
        <div
          className={cn(
            "flex w-full touch-none flex-col items-center gap-3",
            isActive && !isExpanded && "cursor-grab active:cursor-grabbing",
          )}
          onTouchStart={isActive && !isExpanded ? handleTouchStart : undefined}
          onTouchMove={isActive && !isExpanded ? handleTouchMove : undefined}
          onTouchEnd={isActive && !isExpanded ? handleTouchEnd : undefined}
          onMouseDown={isActive && !isExpanded ? handleMouseDown : undefined}
        >
          <CustomImage
            src={`/about/portrait${Array.isArray(photo.image) ? photo.image[0] : photo.image}.jpg`}
            alt={`${photo.name}'s portrait`}
            width={1920}
            height={2556}
            className="w-full touch-none self-stretch rounded-md object-cover"
          />
          <div className="flex h-23 w-full flex-col items-center">
            <p className="font-semibold">{photo.name}</p>
            <div className="flex grow flex-col items-center justify-center font-mono">
              <p className="mt-1 text-center text-xs whitespace-pre-line">
                {photo.description}
              </p>
            </div>
          </div>
          <Reaction
            key={photo.image}
            page={`/about#photo-${photo.image}`}
            size="small"
            className="mt-2 flex max-w-[calc(100%-4rem)] items-center justify-center md:max-w-full"
            onReact={(emoji) => {
              if (isActive && !isExpanded) {
                // Map emoji to direction
                let direction: Direction;
                switch (emoji) {
                  case "💖": // 💖
                    direction = Direction.RIGHT;
                    break;
                  case "😆": // 😆
                    direction = Direction.LEFT;
                    break;
                  case "💅": // 💅
                    direction = Direction.TOP;
                    break;
                  case "🤨": // 🤨
                    direction = Direction.BOTTOM;
                    break;
                  case "😮": // 😮
                    direction = Direction.DOUBLE_TAP;
                    break;
                  default:
                    // For other emojis, default to RIGHT
                    direction = Direction.RIGHT;
                }

                suppressNextSwipeSoundRef.current = true;
                triggerSwipe(direction);
              }
            }}
          />
        </div>
      </div>
    );
  },
);

PhotoCard.displayName = "PhotoCard";
