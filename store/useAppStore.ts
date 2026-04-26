import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppState {
  menuOpened: boolean;
  pauseScrollEvent: boolean;
  soundEffectsEnabled: boolean;
  setMenuOpened: (menuOpened: boolean) => void;
  setPauseScrollEvent: (pauseScrollEvent: boolean) => void;
  setSoundEffectsEnabled: (soundEffectsEnabled: boolean) => void;
  hasHistory: boolean;
  setHasHistory: (hasHistory: boolean) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      menuOpened: false,
      pauseScrollEvent: false,
      soundEffectsEnabled: true,
      hasHistory: false,
      setHasHistory: (hasHistory: boolean) => set(() => ({ hasHistory })),
      setMenuOpened: (menuOpened: boolean) => set(() => ({ menuOpened })),
      setPauseScrollEvent: (pauseScrollEvent: boolean) =>
        set(() => ({ pauseScrollEvent })),
      setSoundEffectsEnabled: (soundEffectsEnabled: boolean) =>
        set(() => ({ soundEffectsEnabled })),
    }),
    {
      name: "app-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        soundEffectsEnabled: state.soundEffectsEnabled,
      }),
    },
  ),
);

export default useAppStore;
