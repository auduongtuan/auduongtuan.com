import {
  MouseEventHandler,
  TouchEventHandler,
  useRef,
  useState,
  useEffect,
} from "react";
import CustomImage from "@atoms/CustomImage";
import Reaction from "@molecules/comment/Reaction";

enum Direction {
  LEFT = "left",
  RIGHT = "right",
}

// Define profile type for TypeScript
interface Profile {
  id: number;
  username: string;
  bio: string;
  image: string;
  swipeDirection?: Direction;
}

// // Simulating the CustomImage and Reaction components since we don't have them
// const CustomImage = ({
//   src,
//   alt,
//   width,
//   height,
//   className,
// }: {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   className: string;
// }) => (
//   <div className={`${className} aspect-[3/4] bg-gray-200`}>
//     {/* <img
//       src="/api/placeholder/400/320"
//       alt={alt}
//       className="h-full w-full object-cover"
//     /> */}
//   </div>
// );

// const Reaction = ({ page, size, className }: {
//   page: string;
//   size: string;
//   className: string;
// }) => (
//   <div className={`${className} flex space-x-2`}>
//     <button className="px-2 py-1 bg-gray-100 rounded text-sm">❤️</button>
//     <button className="px-2 py-1 bg-gray-100 rounded text-sm">💬</button>
//   </div>
// );

interface CardProps {
  profile: Profile;
  onSwipe?: (direction: Direction) => void;
  isActive?: boolean;
  nextCardReady?: () => void;
  index?: number;
  isNext?: boolean;
}

const Card = ({
  profile,
  onSwipe = () => {},
  isActive = false,
  nextCardReady = () => {},
  index = 0,
  isNext = false,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);
  const swipeThreshold = 100; // how far user needs to swipe to trigger action
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Track swipe progress
  const swipeProgress = useRef<number>(0);

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setIsDragging(true);
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    e.preventDefault(); // Prevent text selection
    startX.current = e.clientX;
    currentX.current = startX.current;
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isActive) return;
    const touchX = e.touches[0].clientX;
    updateCardPosition(touchX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault(); // Prevent text selection during drag
    updateCardPosition(e.clientX);
  };

  const updateCardPosition = (currentClientX: number) => {
    const deltaX = currentClientX - startX.current;
    currentX.current = currentClientX;

    // Calculate swipe progress as a percentage of threshold
    swipeProgress.current = Math.abs(deltaX) / swipeThreshold;

    // Notify parent to prepare next card as soon as movement starts
    if (Math.abs(deltaX) > 5) {
      nextCardReady();
    }

    if (cardRef.current) {
      // Apply movement
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;

      // Determine swipe direction for overlay text
      if (deltaX > 20) {
        setSwipeDirection(Direction.RIGHT);
      } else if (deltaX < -20) {
        setSwipeDirection(Direction.LEFT);
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

    if (Math.abs(deltaX) >= swipeThreshold) {
      // Swipe was decisive enough
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
          onSwipe(direction);
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
      ref={cardRef}
      className={`border-divider flex flex-col items-start justify-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${isActive ? "cursor-grab active:cursor-grabbing" : ""} select-none`}
      style={getCardStyle()}
      onTouchStart={isActive ? handleTouchStart : undefined}
      onTouchMove={isActive ? handleTouchMove : undefined}
      onTouchEnd={isActive ? handleTouchEnd : undefined}
      onMouseDown={isActive ? handleMouseDown : undefined}
    >
      {/* Like/Nope Overlay - Only shown on active card when swiping */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="duraction-100 bg-opacity-70 rotate-12 rounded-xl border-4 border-green-500 bg-white px-6 py-2 text-3xl font-bold text-green-500 transition-opacity"
            style={{
              opacity: swipeDirection === Direction.RIGHT ? 1 : 0,
            }}
          >
            LIKE
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="duraction-100 bg-opacity-70 -rotate-12 rounded-xl border-4 border-red-500 bg-white px-6 py-2 text-3xl font-bold text-red-500 transition-opacity"
            style={{
              // opacity: Math.min(1, swipeProgress.current * 1.5),
              opacity: swipeDirection === Direction.LEFT ? 1 : 0,
            }}
          >
            NOPE
          </div>
        </div>
      )}

      <CustomImage
        src={profile.image || "/portrait.jpg"}
        alt={`${profile.username}'s portrait`}
        width={1920}
        height={2556}
        className="w-full self-stretch rounded-md object-cover"
      />
      <div className="w-full font-mono">
        <p className="font-semibold">{profile.username || "@auduongtuan"}</p>
        <p className="mt-1 text-xs whitespace-pre-line">
          {profile.bio ||
            "Lập xuân đua nở hoa đào 🌸\nTim cậu liệu có ai vào hay chưa? 😳"}
        </p>
      </div>
      <Reaction page="/about#avatar" size="small" className="inline-flex" />
    </div>
  );
};

export default function PhotoCards() {
  const initialProfiles: Profile[] = [
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

  // For infinite scrolling, we maintain a queue of profiles that's always being replenished
  const [displayProfiles, setDisplayProfiles] = useState<Profile[]>([]);

  // Store viewed cards
  const [viewedProfiles, setViewedProfiles] = useState<Profile[]>([]);

  // Track if we're preparing for the next card (for smooth transitions)
  const [isPreparingNextCard, setIsPreparingNextCard] =
    useState<boolean>(false);

  // Instead of using currentIndex, we'll shift the array of displayProfiles
  useEffect(() => {
    // Initialize with double the profiles to ensure smooth looping
    const doubledProfiles = [
      ...initialProfiles,
      ...initialProfiles.map((profile) => ({
        ...profile,
        id: profile.id + initialProfiles.length, // Assign new IDs to avoid key conflicts
      })),
    ];
    setDisplayProfiles(doubledProfiles);
  }, []);

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

  const handleSwipe = (direction: Direction) => {
    console.log(`Swiped ${direction} on ${displayProfiles[0]?.username}`);

    // Add current profile to viewed profiles
    const currentProfile = displayProfiles[0];
    setViewedProfiles((prev) => [
      ...prev,
      { ...currentProfile, swipeDirection: direction },
    ]);

    // Remove the swiped card and add a new one at the end to maintain the queue
    setDisplayProfiles((prevProfiles) => {
      const shiftedProfiles = [...prevProfiles.slice(1)];

      // Get the profile to add at the end for infinite scrolling
      // We use modulo to cycle through the initial profiles
      const nextProfileIndex = viewedProfiles.length % initialProfiles.length;
      const nextProfile = {
        ...initialProfiles[nextProfileIndex],
        id: prevProfiles[prevProfiles.length - 1].id + 1, // Generate unique ID
      };

      // Add the next profile to the end of the queue
      return [...shiftedProfiles, nextProfile];
    });

    // Reset the preparation state
    setIsPreparingNextCard(false);
  };

  // We show at most 4 cards at a time for stack effect
  const visibleProfiles = displayProfiles.slice(0, 4);

  return (
    <div className="relative flex h-[32rem] w-full items-start justify-center">
      <div className="relative w-full max-w-md">
        {/* Render all cards using the single Card component */}
        {visibleProfiles.map((profile, index) => (
          <Card
            key={profile.id}
            profile={profile}
            isActive={index === 0}
            onSwipe={index === 0 ? handleSwipe : undefined}
            nextCardReady={index === 0 ? handleNextCardReady : undefined}
            index={index}
            isNext={index === 1 && isPreparingNextCard}
          />
        ))}
      </div>
    </div>
  );
}
