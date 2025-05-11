import { Direction } from "./types";

export const ReactionOverlay = ({
  isActive,
  swipeDirection,
}: {
  isActive: boolean;
  swipeDirection: Direction | null;
}) => {
  return (
    <>
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
    </>
  );
};
