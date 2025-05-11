import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

// Constants
const INSTRUCTION_EXPIRY_DAYS = 14; // 2 weeks

// Create zustand store for instruction overlay
export interface InstructionState {
  hasSeenInstruction: boolean;
  markInstructionAsSeen: () => void;
  setShowInstruction: (flag: boolean) => void;
  showInstruction: boolean;
}
export const useInstructionStore = create<InstructionState>()(
  persist(
    (set) => ({
      hasSeenInstruction: false,
      showInstruction: true,
      markInstructionAsSeen: () => set({ hasSeenInstruction: true }),
      setShowInstruction: (flag: boolean) => set({ showInstruction: flag }),
    }),
    {
      name: "photo-cards-instruction",
      partialize: (state) => ({ hasSeenInstruction: state.hasSeenInstruction }),
      storage: {
        getItem: (
          name,
        ): StorageValue<
          Pick<InstructionState, "hasSeenInstruction">
        > | null => {
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
