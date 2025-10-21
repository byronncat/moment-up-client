"use client";

import { createContext, use, useCallback, useState } from "react";
import * as fabric from "fabric";
import { useCreateData } from "./CreateData";
import { ControlStyles, PositionStyles, TextColors } from "../_constants";

export interface TextStyleUpdate {
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  charSpacing?: number;
  textBackgroundColor?: string;
  stroke?: string;
  strokeWidth?: number;
}

type CanvasContextType = {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.FabricObject | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  addText: () => void;
  updateSelectedText: (updates: TextStyleUpdate) => void;
  addShape: (shapeType: "circle" | "rectangle") => void;
  deleteSelected: () => void;
  exportCanvas: () => string | null;
  setSelectedObject: (object: fabric.FabricObject | null) => void;
};

const CanvasContext = createContext<CanvasContextType>({
  canvas: null,
  selectedObject: null,
  setCanvas: () => {},
  addText: () => {},
  updateSelectedText: () => {},
  addShape: () => {},
  deleteSelected: () => {},
  exportCanvas: () => null,
  setSelectedObject: () => {},
});

export const useCanvas = () => use(CanvasContext);

type CanvasProviderProps = {
  children: React.ReactNode;
};

export default function CanvasProvider({ children }: CanvasProviderProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] =
    useState<fabric.FabricObject | null>(null);
  const { font } = useCreateData();

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new fabric.IText("Add text here", {
      fontFamily: font.family,
      fontSize: 24,
      fill: TextColors[0],
      textAlign: "center",
      editable: true,
      selectable: true,
      ...ControlStyles,
      ...PositionStyles(canvas.width, canvas.height),
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [canvas, font.family]);

  const updateSelectedText = useCallback(
    (updates: TextStyleUpdate) => {
      if (
        !canvas ||
        !selectedObject ||
        !(selectedObject instanceof fabric.IText)
      )
        return;

      selectedObject.set(updates);
      canvas.renderAll();
    },
    [canvas, selectedObject]
  );

  const addShape = useCallback(
    (shapeType: "circle" | "rectangle") => {
      if (!canvas) return;

      let shape: fabric.Object;

      if (shapeType === "circle") {
        shape = new fabric.Circle({
          radius: 50,
          fill: "rgba(255, 255, 255, 0.3)",
          stroke: "white",
          strokeWidth: 2,
          ...ControlStyles,
          ...PositionStyles(canvas.width, canvas.height),
        });
      } else {
        shape = new fabric.Rect({
          width: 100,
          height: 60,
          fill: "rgba(255, 255, 255, 0.3)",
          stroke: "white",
          strokeWidth: 2,
          ...ControlStyles,
          ...PositionStyles(canvas.width, canvas.height),
        });
      }

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    },
    [canvas]
  );

  const deleteSelected = useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();

    if (activeObject && !(activeObject instanceof fabric.FabricImage)) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }, [canvas]);

  const exportCanvas = useCallback(() => {
    if (!canvas) return null;

    return canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // Higher resolution export
    });

    // Auto download the image
    // const link = document.createElement("a");
    // link.download = "canvas-export.png";
    // link.href = dataUrl;
    // link.click();
  }, [canvas]);

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        selectedObject,
        setSelectedObject,
        addText,
        addShape,
        deleteSelected,
        exportCanvas,
        updateSelectedText,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}
