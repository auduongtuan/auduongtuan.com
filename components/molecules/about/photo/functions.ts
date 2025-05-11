import { Photo, Direction } from "./types";
import { trackEvent } from "@lib/utils";
import {
  CARD_STACK_SCALE_OFFSET,
  CARD_STACK_TRANSLATE_Y_OFFSET,
} from "./constants";
import axios from "axios";

export function giveReaction(emoji: string, photo: Photo) {
  axios
    .post("/api/reaction", {
      react: emoji,
      page: "/about#photo-" + photo.id,
      type: "ADD",
    })
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      // console.error(err);
    });
}

export function swipeAction(direction: Direction, photo: Photo) {
  switch (direction) {
    case Direction.LEFT:
      // Handle dislike
      // Example: await api.dislikePhoto(photo.id);
      giveReaction("🤨", photo);
      trackEvent({
        event: "swipe_reaction",
        content: "left",
        page: "/about#photo-" + photo.id,
      });
      break;
    case Direction.RIGHT:
      // Handle like
      // Example: await api.likePhoto(photo.id);
      giveReaction("💖", photo);
      trackEvent({
        event: "swipe_reaction",
        content: "right",
        page: "/about#photo-" + photo.id,
      });
      break;
    case Direction.TOP:
      // Handle super like
      // Example: await api.superLikePhoto(photo.id);
      giveReaction("💅", photo);
      trackEvent({
        event: "swipe_reaction",
        content: "top",
        page: "/about#photo-" + photo.id,
      });
      break;
  }
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
