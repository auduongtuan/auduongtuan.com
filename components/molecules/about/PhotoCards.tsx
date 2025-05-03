import { useRef, useState, useEffect, useMemo } from "react";
import { Photo, Direction } from "./types";
import { useInstructionStore, InstructionOverlay } from "./InstructionOverlay";
import { PhotoCard } from "./PhotoCard";
import axios from "axios";
import { trackEvent } from "@lib/utils";

function giveReaction(emoji: string, photo: Photo) {
  axios
    .post("/api/reaction", {
      react: emoji,
      page: "/about#" + photo.id,
      type: "ADD",
    })
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      // console.error(err);
    });
}

export default function PhotoCards() {
  /**
   * The initial photos to display when the component mounts. These are "dummy"
   * photos and are not actually fetched from the database.
   *
   * TODO: Replace these with real photos from the database.
   */
  const initialPhotos: Photo[] = [
    {
      id: 1,
      username: "@auduongtuan",
      bio: "Lập xuân đua nở hoa đào 🌸\nTim cậu liệu có ai vào hay chưa? 😳",
      image: "/portrait.jpg",
    },
    {
      id: 2,
      username: "@jane_doe",
      bio: "Travel enthusiast ✈️\nAlways looking for the next adventure!",
      image: "/portrait.jpg",
    },
    {
      id: 3,
      username: "@john_smith",
      bio: "Coffee addict ☕\nBook lover 📚\nTech geek 💻",
      image: "/portrait.jpg",
    },
    {
      id: 4,
      username: "@lisa_wong",
      bio: "Photographer 📸\nNature lover 🌿\nDog person 🐕",
      image: "/portrait.jpg",
    },
  ];

  // For infinite scrolling, we maintain a queue of photos that's always being replenished
  const [displayPhotos, setDisplayPhotos] = useState<Photo[]>([]);

  // Store viewed cards
  const [viewedPhotos, setViewedPhotos] = useState<Photo[]>([]);

  // Track if we're preparing for the next card (for smooth transitions)
  const [isPreparingNextCard, setIsPreparingNextCard] =
    useState<boolean>(false);

  // Get instruction state from zustand store
  const { hasSeenInstruction, markInstructionAsSeen } = useInstructionStore();
  const [showInstruction, setShowInstruction] = useState(false);

  // Instead of using currentIndex, we'll shift the array of displayPhotos
  useEffect(() => {
    // Initialize with double the photos to ensure smooth looping
    const doubledPhotos = [
      ...initialPhotos,
      ...initialPhotos.map((photo) => ({
        ...photo,
        id: photo.id + initialPhotos.length, // Assign new IDs to avoid key conflicts
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
        cardElement.style.transform = `translateY(${10 * index}px) scale(${1 - 0.05 * index})`;
      });
    }
  };

  const handleSwipe = (direction: Direction, photo: Photo) => {
    console.log(`Swiped ${direction} on ${photo.username}`);

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
      const nextPhotoIndex = viewedPhotos.length % initialPhotos.length;
      const nextPhoto = {
        ...initialPhotos[nextPhotoIndex],
        id: prevPhotos[prevPhotos.length - 1].id + 1, // Generate unique ID
      };

      // Add the next photo to the end of the queue
      return [...shiftedPhotos, nextPhoto];
    });

    // Reset the preparation state
    setIsPreparingNextCard(false);

    // Here you can add any API calls or other actions based on the swipe direction
    // Example:
    switch (direction) {
      case Direction.LEFT:
        // Handle dislike
        // Example: await api.dislikePhoto(photo.id);
        giveReaction("🤨", photo);
        trackEvent({
          event: "swipe_reaction",
          content: "left",
          page: "/about#" + photo.id,
        });
        break;
      case Direction.RIGHT:
        // Handle like
        // Example: await api.likePhoto(photo.id);
        giveReaction("💖", photo);
        trackEvent({
          event: "swipe_reaction",
          content: "right",
          page: "/about#" + photo.id,
        });
        break;
      case Direction.TOP:
        // Handle super like
        // Example: await api.superLikePhoto(photo.id);
        giveReaction("💅", photo);
        trackEvent({
          event: "swipe_reaction",
          content: "top",
          page: "/about#" + photo.id,
        });
        break;
    }
  };

  // Handle closing the instruction overlay
  const handleCloseInstruction = () => {
    setShowInstruction(false);
    markInstructionAsSeen();
  };

  // We show at most 4 cards at a time for stack effect
  const visiblePhotos = displayPhotos.slice(0, 4);

  const cardRefs = useRef<Record<number, HTMLDivElement>>({});

  const highestHeight = useMemo(() => {
    let highest = 0;
    Object.values(cardRefs.current).forEach((card) => {
      if (card.offsetHeight > highest) {
        highest = card.offsetHeight;
      }
    });
    return highest;
  }, [cardRefs.current]);

  return (
    <div className="relative flex w-full items-start justify-center">
      <div className="relative w-full" style={{ height: `${highestHeight}px` }}>
        {/* Render all cards using the single Card component */}
        {visiblePhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isActive={index === 0}
            onSwipe={index === 0 ? handleSwipe : undefined}
            nextCardReady={index === 0 ? handleNextCardReady : undefined}
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
          />
        ))}
      </div>

      {/* Instruction Overlay */}
      {showInstruction && (
        <InstructionOverlay onClose={handleCloseInstruction} />
      )}
    </div>
  );
}
