import { create } from "zustand";

export interface AppState {
  headerInView: boolean;
  menuOpened: boolean;
  pauseScrollEvent: boolean;
  setHeaderInView: (headerInView: boolean) => void;
  setMenuOpened: (menuOpened: boolean) => void;
  setPauseScrollEvent: (pauseScrollEvent: boolean) => void;
  hasHistory: boolean;
  setHasHistory: (hasHistory: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  headerInView: true,
  menuOpened: false,
  pauseScrollEvent: false,
  hasHistory: false,
  setHasHistory: (hasHistory: boolean) => set((state) => ({ hasHistory })),
  setHeaderInView: (headerInView: boolean) =>
    set((state) => ({ headerInView })),
  setMenuOpened: (menuOpened: boolean) => set((state) => ({ menuOpened })),
  setPauseScrollEvent: (pauseScrollEvent: boolean) =>
    set((state) => ({ pauseScrollEvent })),
}));

export default useAppStore;
