import React, { useContext, useState } from "react";
type AppContextType = {
  headerInView?: boolean | null,
  menuOpened?: boolean | null,
  webName: string,
  titleSeparator: string,
  setMenuOpened?: Function,
  setHeaderInView?: Function,
  [key: string]: any;
};
const defaultAppContextValues = {
  webName: 'AU DUONG TUAN',
  titleSeparator: ' | '
};
const AppContext = React.createContext<AppContextType>(defaultAppContextValues);
export function AppWrapper({ children }: { children: React.ReactNode }) {

  const [headerInView, setHeaderInView] = useState(true);
  const [menuOpened, setMenuOpened] = useState(false);
  const sharedState = {
    ...defaultAppContextValues,
    headerInView: headerInView,
    menuOpened: menuOpened,
    setMenuOpened: setMenuOpened,
    setHeaderInView: setHeaderInView
  };
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  return useContext(AppContext);
}
