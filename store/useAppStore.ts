import { create } from "zustand";

export interface AppState {
  menuOpened: boolean;
  pauseScrollEvent: boolean;
  setMenuOpened: (menuOpened: boolean) => void;
  setPauseScrollEvent: (pauseScrollEvent: boolean) => void;
  hasHistory: boolean;
  setHasHistory: (hasHistory: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  menuOpened: false,
  pauseScrollEvent: false,
  hasHistory: false,
  setHasHistory: (hasHistory: boolean) => set((state) => ({ hasHistory })),
  setMenuOpened: (menuOpened: boolean) => set((state) => ({ menuOpened })),
  setPauseScrollEvent: (pauseScrollEvent: boolean) =>
    set((state) => ({ pauseScrollEvent })),
}));

export default useAppStore;
