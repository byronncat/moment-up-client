"use client";

import { type RefObject, createContext, use, useRef } from "react";

type KeyContextType = {
  postKey: RefObject<number>;
  incrementPostKey: () => void;
};

const KeyContext = createContext<KeyContextType>({
  postKey: { current: 0 },
  incrementPostKey: () => {},
});

export const useKey = () => use(KeyContext);

type KeyProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function KeyProvider({ children }: KeyProviderProps) {
  const postKey = useRef(0);

  return (
    <KeyContext.Provider
      value={{
        postKey,
        incrementPostKey: () => {
          postKey.current++;
        },
      }}
    >
      {children}
    </KeyContext.Provider>
  );
}
