import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { MdOutlineSwipe } from "react-icons/md";
import Button from "@atoms/Button";
import { Transition } from "@headlessui/react";
import Balancer from "react-wrap-balancer";

// Instruction Overlay Component
export const InstructionOverlay = ({ onClose }: { onClose: () => void }) => {
  const { hasSeenInstruction, markInstructionAsSeen } = useInstructionStore();

  const handleClose = () => {
    markInstructionAsSeen();
    onClose();
  };

  return (
    <Transition show={!hasSeenInstruction}>
      <div className="absolute inset-0 z-30 flex h-full items-center justify-center transition-opacity data-closed:opacity-0 data-enter:duration-100 data-leave:duration-100">
        <div className="animate-shadow-grow absolute inset-0 top-1/2 left-1/2 h-[calc(100%-50px)] w-[calc(100%-10px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-2xl" />
        <div className="text-primary z-1 mx-4 flex max-w-md flex-col items-center">
          <div className="flex items-center justify-center text-4xl">
            <MdOutlineSwipe className="animate-hand-wave text-accent origin-bottom" />
          </div>
          <h3 className="mt-4 text-center text-xl font-bold">
            How to interact
          </h3>
          <Balancer className="mt-2 text-center" as="p">
            Swipe left/right/top to give reactions to this photo (just like
            Tinder)
          </Balancer>

          <Button onClick={handleClose} className="mt-4">
            Got it
          </Button>
        </div>
      </div>
    </Transition>
  );
};

// Constants
const INSTRUCTION_EXPIRY_DAYS = 14; // 2 weeks

// Create zustand store for instruction overlay
export interface InstructionState {
  hasSeenInstruction: boolean;
  markInstructionAsSeen: () => void;
}

export const useInstructionStore = create<InstructionState>()(
  persist(
    (set) => ({
      hasSeenInstruction: false,
      markInstructionAsSeen: () => set({ hasSeenInstruction: true }),
    }),
    {
      name: "photo-cards-instruction",
      storage: {
        getItem: (name): StorageValue<InstructionState> | null => {
          const storedValue = localStorage.getItem(name);
          if (!storedValue) return null;

          try {
            const data = JSON.parse(storedValue);
            const storedDate = new Date(data.state.timestamp || new Date());
            const daysPassed =
              (new Date().getTime() - storedDate.getTime()) /
              (1000 * 60 * 60 * 24);

            return daysPassed > INSTRUCTION_EXPIRY_DAYS ? null : data;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const valueAsString = JSON.stringify(value);
            const data = JSON.parse(valueAsString);
            const valueWithTimestamp = {
              ...data,
              state: {
                ...data.state,
                timestamp: new Date().toISOString(),
              },
            };
            localStorage.setItem(name, JSON.stringify(valueWithTimestamp));
          } catch {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
