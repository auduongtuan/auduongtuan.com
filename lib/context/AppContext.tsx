import React, { useContext, useState } from "react";
type AppContextType = {
  headerInView?: boolean | null,
  webName: string,
  titleSeparator: string,
  setHeaderInView?: Function,
  [key: string]: any;
};
const defaultAppContextValues = {
  webName: 'Tuan Portfolio',
  titleSeparator: ' | '
};
const AppContext = React.createContext<AppContextType>(defaultAppContextValues);
export function AppWrapper({ children }: { children: React.ReactNode }) {

  const [headerInView, setHeaderInView] = useState(null);
  const sharedState = {
    ...defaultAppContextValues,
    headerInView: headerInView,
    setHeaderInView: setHeaderInView
  };
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  return useContext(AppContext);
}
