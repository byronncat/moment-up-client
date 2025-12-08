"use client";

// === Type ===
type SettingsContextType = {
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
};

// === Provider ===
import { createContext, use, useState } from "react";

const SettingsContext = createContext<SettingsContextType>({
  currentTitle: "Settings",
  setCurrentTitle: () => {},
});

export const useSettings = () => use(SettingsContext);

type SettingsProviderProps = {
  children: React.ReactNode;
};

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [currentTitle, setCurrentTitle] = useState("Your profile");

  return (
    <SettingsContext.Provider
      value={{
        currentTitle,
        setCurrentTitle,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
