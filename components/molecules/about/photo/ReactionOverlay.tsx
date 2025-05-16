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
            className="reaction-overlay duration-100 bg-opacity-70 rotate-12 rounded-xl border-4 border-green-500 bg-white px-6 py-2 text-3xl font-bold text-green-500 transition-opacity"
            data-direction={Direction.RIGHT}
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
            className="reaction-overlay duration-100 bg-opacity-70 -rotate-12 rounded-xl border-4 border-yellow-500 bg-white px-6 py-2 text-3xl font-bold text-yellow-500 transition-opacity"
            data-direction={Direction.LEFT}
            style={{
              opacity: swipeDirection === Direction.LEFT ? 1 : 0,
            }}
          >
            😆 HAHA
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="reaction-overlay duration-100 bg-opacity-70 rounded-xl border-4 border-blue-500 bg-white px-6 py-2 text-3xl font-bold text-blue-500 transition-opacity"
            data-direction={Direction.TOP}
            style={{
              opacity: swipeDirection === Direction.TOP ? 1 : 0,
            }}
          >
            💅 SLAY
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="reaction-overlay duration-100 bg-opacity-70 rounded-xl border-4 border-red-500 bg-white px-6 py-2 text-3xl font-bold text-red-500 transition-opacity"
            data-direction={Direction.BOTTOM}
            style={{
              opacity: swipeDirection === Direction.BOTTOM ? 1 : 0,
            }}
          >
            🤨 EWW
          </div>
        </div>
      )}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="reaction-overlay duration-100 bg-opacity-70 scale-110 rounded-xl border-4 border-purple-500 bg-white px-6 py-2 text-3xl font-bold text-purple-500 transition-opacity"
            data-direction={Direction.DOUBLE_TAP}
            style={{
              opacity: swipeDirection === Direction.DOUBLE_TAP ? 1 : 0,
            }}
          >
            😮 WOW
          </div>
        </div>
      )}
    </>
  );
};
