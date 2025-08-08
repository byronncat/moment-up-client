"use client";

import { createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "@/constants/clientConfig";

type HomeContextType = {
  hideStories: boolean;
  setHideStories: (hide: boolean) => void;
};

const HomeContext = createContext<HomeContextType>({
  hideStories: false,
  setHideStories: () => {},
});

export const useHome = () => useContext(HomeContext);

export default function HomeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [hideStories, setHideStories] = useLocalStorage(
    LocalStorageKey.STORIES_DISPLAY,
    false
  );
  return (
    <HomeContext.Provider
      value={{
        hideStories,
        setHideStories,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
