"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type HomeContextType = {
  hideFeeds: boolean;
  setHideFeeds: (hide: boolean) => void;
  momentLoaded: boolean;
  loadedSuccess: () => void;
};

const HomeContext = createContext<HomeContextType>({
  hideFeeds: false,
  setHideFeeds: () => {},
  momentLoaded: false,
  loadedSuccess: () => {},
});

export const useHome = () => useContext(HomeContext);

export default function HomeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hideFeeds, setHideFeeds] = useLocalStorage("hideFeeds", false);
  const [momentLoaded, setMomentLoaded] = useState(false);

  const loadedSuccess = useCallback(() => {
    setMomentLoaded(true);
  }, []);

  return (
    <HomeContext.Provider
      value={{
        hideFeeds,
        setHideFeeds,
        momentLoaded,
        loadedSuccess,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
