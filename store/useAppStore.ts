import { create } from "zustand";

export interface AppState {
  headerInView: boolean;
  menuOpened: boolean;
  pauseScrollEvent: boolean;
  setHeaderInView: (headerInView: boolean) => void;
  setMenuOpened: (menuOpened: boolean) => void;
  setPauseScrollEvent: (pauseScrollEvent: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  headerInView: true,
  menuOpened: false,
  pauseScrollEvent: false,
  setHeaderInView: (headerInView: boolean) =>
    set((state) => ({ headerInView })),
  setMenuOpened: (menuOpened: boolean) => set((state) => ({ menuOpened })),
  setPauseScrollEvent: (pauseScrollEvent: boolean) =>
    set((state) => ({ pauseScrollEvent })),
}));

export default useAppStore;
