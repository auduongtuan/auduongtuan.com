import { create } from "zustand";

interface PhotoStoreState {
  isPreparingNextCard: boolean;
  setIsPreparingNextCard: (flag: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (flag: boolean) => void;
  isExpanding: boolean;
  setIsExpanding: (flag: boolean) => void;
}

export const usePhotoStore = create<PhotoStoreState>((set) => ({
  isPreparingNextCard: false,
  setIsPreparingNextCard: (flag: boolean) => set({ isPreparingNextCard: flag }),
  isExpanded: false,
  setIsExpanded: (flag: boolean) => set({ isExpanded: flag }),
  isExpanding: false,
  setIsExpanding: (flag: boolean) => set({ isExpanding: flag }),
}));
