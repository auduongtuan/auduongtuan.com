import React, { useContext, useState } from "react";
type AppContextType = {
  headerInView: boolean,
  menuOpened: boolean,
  webName: string,
  titleSeparator: string,
  setMenuOpened: Function,
  setHeaderInView: Function,
  pauseScrollEvent: boolean;
  setPauseScrollEvent: Function;
  [key: string]: any;
};
const defaultAppContextValues = {
  webName: 'AU DUONG TUAN',
  titleSeparator: ' | '
};
const AppContext = React.createContext<AppContextType | undefined>(undefined);
export function AppWrapper({ children }: { children: React.ReactNode }) {

  const [headerInView, setHeaderInView] = useState(true);
  const [menuOpened, setMenuOpened] = useState(false);
  const [pauseScrollEvent, setPauseScrollEvent] = useState(false);
  const sharedState = {
    ...defaultAppContextValues,
    headerInView,
    menuOpened,
    setMenuOpened,
    setHeaderInView,
    pauseScrollEvent,
    setPauseScrollEvent
  };
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  return useContext(AppContext) as AppContextType;
}
