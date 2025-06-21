"use client";

import { createContext, useCallback, useContext, useState } from "react";

const HomeContext = createContext(
  {} as {
    hideFeeds: boolean;
    setHideFeeds: (hide: boolean) => void;
    momentLoaded: boolean;
    loadedSuccess: () => void;
  }
);

export const useHome = () => useContext(HomeContext);

export default function HomeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hideFeeds, setHideFeeds] = useState(false);
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
