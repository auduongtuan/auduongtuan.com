import { Direction, DisplayPhoto } from "./types";
import { playReactionSound } from "@lib/audio/uiSounds";
import { isDevEnvironment, trackEvent } from "@lib/utils";
import {
  CARD_STACK_SCALE_OFFSET,
  CARD_STACK_TRANSLATE_Y_OFFSET,
} from "./constants";
import axios from "axios";

type SwipeReaction = {
  emoji: string;
  event: "swipe" | "double_tap";
};

export function giveReaction(
  emoji: string,
  photo: DisplayPhoto,
  event: "click" | "swipe" | "double_tap" = "click",
) {
  // console.log("give reaction", photo.image);
  if (isDevEnvironment) return;
  axios
    .post("/api/reaction", {
      react: emoji,
      page: "/about#photo-" + photo.image,
      type: "ADD",
      event: event,
    })
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      // console.error(err);
    });
}

export function getSwipeReaction(direction: Direction): SwipeReaction {
  switch (direction) {
    case Direction.LEFT:
      return { emoji: "😆", event: "swipe" };

    case Direction.RIGHT:
      return { emoji: "💖", event: "swipe" };

    case Direction.TOP:
      return { emoji: "💅", event: "swipe" };

    case Direction.BOTTOM:
      return { emoji: "🤨", event: "swipe" };

    case Direction.DOUBLE_TAP:
      return { emoji: "😮", event: "double_tap" };
  }
}

export function swipeAction(
  direction: Direction,
  photo: DisplayPhoto,
  options: { playSound?: boolean } = {},
) {
  const reaction = getSwipeReaction(direction);

  if (options.playSound !== false) {
    playReactionSound(reaction.emoji, true);
  }

  giveReaction(reaction.emoji, photo, reaction.event);
}
export const getStackCardTransform = (index: number) => {
  return `translateY(${CARD_STACK_TRANSLATE_Y_OFFSET * (index || 0)}px) scale(${1 - CARD_STACK_SCALE_OFFSET * (index || 0)})`;
};

export const calculateCardStackHeight = (cardEls: HTMLElement[]) => {
  return (
    cardEls.reduce((prev, card) => {
      return Math.max(prev, card.offsetHeight);
    }, 0) +
    CARD_STACK_TRANSLATE_Y_OFFSET * (cardEls.length - 1)
  );
};

export const calculateGridLayoutHeight = (
  cardEls: HTMLElement[],
  {
    columns,
    gapY,
  }: {
    columns: number;
    gapY: number;
  },
) => {
  const bestHeightInRow = new Map<number, number>();

  cardEls.forEach((card, index) => {
    const row = Math.floor(index / columns);
    const rect = card.getBoundingClientRect();
    const height = rect.height;
    if (!bestHeightInRow.has(row)) {
      bestHeightInRow.set(row, height);
    } else {
      bestHeightInRow.set(row, Math.max(bestHeightInRow.get(row)!, height));
    }
  });

  return (
    Array.from(bestHeightInRow.values()).reduce((a, b) => a + b + gapY, 0) -
    gapY
  );
};

export const calculateGridRowOffsets = (
  cardEls: HTMLElement[],
  {
    columns,
    gapY,
  }: {
    columns: number;
    gapY: number;
  },
) => {
  const bestHeightInRow = new Map<number, number>();

  cardEls.forEach((card, index) => {
    const row = Math.floor(index / columns);
    const height = card.getBoundingClientRect().height;
    bestHeightInRow.set(row, Math.max(bestHeightInRow.get(row) || 0, height));
  });

  let currentOffset = 0;
  const rowOffsets = new Map<number, number>();

  Array.from(bestHeightInRow.entries())
    .sort(([rowA], [rowB]) => rowA - rowB)
    .forEach(([row, height]) => {
      rowOffsets.set(row, currentOffset);
      currentOffset += height + gapY;
    });

  return rowOffsets;
};
