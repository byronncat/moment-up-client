"use client";

import { createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "@/constants/clientConfig";

type HomeContextType = {
  hideFeeds: boolean;
  setHideFeeds: (hide: boolean) => void;
};

const HomeContext = createContext<HomeContextType>({
  hideFeeds: false,
  setHideFeeds: () => {},
});

export const useHome = () => useContext(HomeContext);

export default function HomeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hideFeeds, setHideFeeds] = useLocalStorage(
    LocalStorageKey.FEEDS_DISPLAY,
    false
  );
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
