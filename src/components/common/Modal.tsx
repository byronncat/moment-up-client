"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { FocusTrap } from "focus-trap-react";
import { cn } from "@/libraries/utils";

type FocusTrapContextType = {
  isFocusTrapEnabled: boolean;
  setFocusTrapEnabled: (enabled: boolean) => void;
};

const FocusTrapContext = createContext<FocusTrapContextType>({
  isFocusTrapEnabled: true,
  setFocusTrapEnabled: () => {},
});

export const useFocusTrap = () => useContext(FocusTrapContext);

type FocusTrapProviderProps = {
  children: React.ReactNode;
  defaultEnabled?: boolean;
};

export function FocusTrapProvider({
  children,
  defaultEnabled = true,
}: FocusTrapProviderProps) {
  const [isFocusTrapEnabled, setIsFocusTrapEnabled] = useState(defaultEnabled);

  const setFocusTrapEnabled = (enabled: boolean) => {
    setIsFocusTrapEnabled(enabled);
  };

  return (
    <FocusTrapContext.Provider
      value={{ isFocusTrapEnabled, setFocusTrapEnabled }}
    >
      {children}
    </FocusTrapContext.Provider>
  );
}

type ModalProps = Readonly<{
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}>;

export default function Modal({ children, onClose, className }: ModalProps) {
  const { isFocusTrapEnabled } = useFocusTrap();

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) onClose?.();
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <FocusTrap active={isFocusTrapEnabled}>
      <div
        className={cn(
          "top-0 right-0 absolute z-30",
          "size-full",
          "bg-black/80",
          className
        )}
        onClick={handleBackdropClick}
      >
        {children}
      </div>
    </FocusTrap>
  );
}
