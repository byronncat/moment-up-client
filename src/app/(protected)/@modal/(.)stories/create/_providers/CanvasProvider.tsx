"use client";

import { createContext, useContext, useState } from "react";
import * as fabric from "fabric";

type CanvasContextType = {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
};

const CanvasContext = createContext<CanvasContextType>({
  canvas: null,
  setCanvas: () => {},
});

export const useCanvas = () => useContext(CanvasContext);

type CanvasProviderProps = {
  children: React.ReactNode;
};

export default function CanvasProvider({ children }: CanvasProviderProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  return (
    <CanvasContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
}
