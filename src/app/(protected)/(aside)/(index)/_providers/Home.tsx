"use client";

import { createContext, useContext, useState } from "react";

type HomeContextType = {
  hideFeeds: boolean;
  setHideFeeds: (hide: boolean) => void;
};

const HomeContext = createContext({} as HomeContextType);

export const useHome = () => useContext(HomeContext);

export default function HomeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hideFeeds, setHideFeeds] = useState(false);

  return (
    <HomeContext.Provider
      value={{
        hideFeeds,
        setHideFeeds,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
