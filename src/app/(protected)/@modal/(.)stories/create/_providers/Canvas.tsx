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
  addImage: (file: File) => Promise<void>;
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
  addImage: async () => {},
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

    const text = new fabric.IText("", {
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
    text.enterEditing();
    text.selectAll();
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

  const addImage = useCallback(
    async (file: File) => {
      if (!canvas) return;

      const url = URL.createObjectURL(file);

      try {
        const image = await fabric.FabricImage.fromURL(url);

        // Scale image to fit canvas while maintaining aspect ratio
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.8;
        const scaleX = maxWidth / image.width;
        const scaleY = maxHeight / image.height;
        const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

        image.set({
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          ...ControlStyles,
          ...PositionStyles(canvas.width, canvas.height),
        });

        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
      } finally {
        URL.revokeObjectURL(url);
      }
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

  function exportCanvas() {
    if (!canvas) return null;

    return canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
  }

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        selectedObject,
        setSelectedObject,
        addText,
        addShape,
        addImage,
        deleteSelected,
        exportCanvas,
        updateSelectedText,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}
