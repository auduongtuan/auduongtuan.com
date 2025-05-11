"use client";
import React from "react";
import { Direction, Photo } from "./types";
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
  photo: Photo;
  onSwipe?: (direction: Direction, photo: Photo) => void;
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
    } = usePhotoCardSwipe({
      index,
      cardRef,
      onSwipe,
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
            : `transform 0.3s ease, opacity 0.3s ease${isExpanding ? ", left 0.3s ease-in-out, top 0.3s ease-in-out" : ""}`,
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
            : `transform 0.3s ease, opacity 0.3s ease${isExpanding ? ", left 0.3s ease-in-out, top 0.3s ease-in-out" : ""}`,
        };
      }
    };

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
      if (!isExpanded) {
        Object.assign(card.style, getCardStyle());
        return;
      }
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const columns = Number(
        getComputedStyle(card).getPropertyValue("--columns"),
      );
      const column = (index || 0) % columns;
      const row = Math.floor((index || 0) / columns);
      card.style.opacity = "1";
      card.style.transform = "";
      card.style.left = `calc((${cardWidth}px + var(--gap-x)) * ${column})`;
      card.style.top = `calc((${cardHeight}px + var(--gap-y)) * ${row})`;
    }, [isExpanded, index, cardRef.current, getCardStyle]);

    return (
      <div
        data-card-type={isActive ? "active" : "stack"}
        ref={combinedRef}
        className={cn(
          `border-divider flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-3 pt-3 pb-4 shadow-lg`,
          isActive && !isExpanded && "cursor-grab active:cursor-grabbing",
          "select-none",
          className,
        )}
        style={getCardStyle()}
        onTouchStart={isActive && !isExpanded ? handleTouchStart : undefined}
        onTouchMove={isActive && !isExpanded ? handleTouchMove : undefined}
        onTouchEnd={isActive && !isExpanded ? handleTouchEnd : undefined}
        onMouseDown={isActive && !isExpanded ? handleMouseDown : undefined}
      >
        <ReactionOverlay isActive={isActive} swipeDirection={swipeDirection} />
        <CustomImage
          src={Array.isArray(photo.image) ? photo.image[0] : photo.image}
          alt={`${photo.name}'s portrait`}
          width={1920}
          height={2556}
          className="w-full self-stretch rounded-md object-cover"
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
          page={`/about#photo-${photo.id}`}
          size="small"
          className="mt-2 flex items-center justify-center"
        />
      </div>
    );
  },
);

PhotoCard.displayName = "PhotoCard";
