"use client";

import { useState, useCallback } from "react";
import { cn } from "@/libraries/utils";
import * as fabric from "fabric";

interface DrawingToolsProps {
  canvasRef: React.MutableRefObject<any>;
  className?: string;
}

const DRAWING_COLORS = [
  "#ffffff", // White
  "#000000", // Black
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ffff00", // Yellow
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ffa500", // Orange
  "#800080", // Purple
];

const BRUSH_SIZES = [2, 5, 10, 15, 20, 30];

type DrawingMode = "select" | "draw" | "erase" | "arrow" | "line";

export default function DrawingTools({
  canvasRef,
  className,
}: DrawingToolsProps) {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("select");
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const enableDrawingMode = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushSize;
    setDrawingMode("draw");
    canvas.selection = false;
    setIsDrawing(true);
  }, [canvasRef, brushColor, brushSize]);

  const enableSelectMode = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.isDrawingMode = false;
    canvas.selection = true;
    setDrawingMode("select");
    setIsDrawing(false);
  }, [canvasRef]);

  const enableEraseMode = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.isDrawingMode = true;
    // Use PencilBrush with white color as eraser fallback
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = canvas.backgroundColor || "#ffffff";
    canvas.freeDrawingBrush.width = brushSize;
    setDrawingMode("erase");
    canvas.selection = false;
    setIsDrawing(true);
  }, [canvasRef, brushSize]);

  const handleBrushColorChange = useCallback(
    (color: string) => {
      setBrushColor(color);
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      if (canvas.isDrawingMode && drawingMode === "draw") {
        canvas.freeDrawingBrush.color = color;
      }
    },
    [canvasRef, drawingMode]
  );

  const handleBrushSizeChange = useCallback(
    (size: number) => {
      setBrushSize(size);
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.width = size;
      }
    },
    [canvasRef]
  );

  const addArrow = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Create arrow using a path
    const arrowPath = new fabric.Path("M 0 0 L 20 10 L 0 20 L 5 10 Z", {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fill: brushColor,
      originX: "center",
      originY: "center",
      selectable: true,
    });

    canvas.add(arrowPath);
    canvas.setActiveObject(arrowPath);
    canvas.renderAll();
  }, [canvasRef, brushColor]);

  const addLine = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const line = new fabric.Line([50, 100, 200, 100], {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      stroke: brushColor,
      strokeWidth: brushSize,
      originX: "center",
      originY: "center",
      selectable: true,
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  }, [canvasRef, brushColor, brushSize]);

  const addCircle = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const circle = new fabric.Circle({
      radius: 50,
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fill: "transparent",
      stroke: brushColor,
      strokeWidth: brushSize,
      originX: "center",
      originY: "center",
      selectable: true,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  }, [canvasRef, brushColor, brushSize]);

  const addRectangle = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const rectangle = new fabric.Rect({
      width: 100,
      height: 60,
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fill: "transparent",
      stroke: brushColor,
      strokeWidth: brushSize,
      originX: "center",
      originY: "center",
      selectable: true,
    });

    canvas.add(rectangle);
    canvas.setActiveObject(rectangle);
    canvas.renderAll();
  }, [canvasRef, brushColor, brushSize]);

  const clearDrawings = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const objects = canvas.getObjects();

    // Remove all drawing objects (paths, lines, shapes) but keep images and text
    const drawingObjects = objects.filter(
      (obj: any) =>
        obj.type === "path" ||
        obj.type === "line" ||
        (obj.type === "circle" && obj.fill === "transparent") ||
        (obj.type === "rect" && obj.fill === "transparent")
    );

    drawingObjects.forEach((obj: any) => canvas.remove(obj));
    canvas.renderAll();
  }, [canvasRef]);

  const undoLastDrawing = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const objects = canvas.getObjects();

    if (objects.length > 0) {
      const lastObject = objects[objects.length - 1];
      canvas.remove(lastObject);
      canvas.renderAll();
    }
  }, [canvasRef]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drawing Modes */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Drawing Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={enableSelectMode}
            className={cn(
              "py-2 px-3 text-sm rounded transition-colors",
              drawingMode === "select"
                ? "bg-accent-dark text-white"
                : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
            )}
          >
            Select
          </button>
          <button
            onClick={enableDrawingMode}
            className={cn(
              "py-2 px-3 text-sm rounded transition-colors",
              drawingMode === "draw"
                ? "bg-accent-dark text-white"
                : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
            )}
          >
            Draw
          </button>
          <button
            onClick={enableEraseMode}
            className={cn(
              "py-2 px-3 text-sm rounded transition-colors col-span-2",
              drawingMode === "erase"
                ? "bg-accent-dark text-white"
                : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
            )}
          >
            Eraser
          </button>
        </div>
      </div>

      {/* Brush Settings */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Brush Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {DRAWING_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleBrushColorChange(color)}
              className={cn(
                "w-8 h-8 rounded border-2 transition-all",
                brushColor === color
                  ? "border-accent-dark scale-110"
                  : "border-border-dark hover:border-accent-dark/50"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Brush Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleBrushSizeChange(size)}
              className={cn(
                "py-2 px-3 text-sm rounded transition-colors",
                brushSize === size
                  ? "bg-accent-dark text-white"
                  : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
              )}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Shape Tools */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Shapes & Lines
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={addLine}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Line
          </button>
          <button
            onClick={addArrow}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Arrow
          </button>
          <button
            onClick={addCircle}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Circle
          </button>
          <button
            onClick={addRectangle}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Rectangle
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Actions
        </label>
        <div className="space-y-2">
          <button
            onClick={undoLastDrawing}
            className="w-full py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Undo Last
          </button>
          <button
            onClick={clearDrawings}
            className="w-full py-2 px-3 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors text-sm"
          >
            Clear All Drawings
          </button>
        </div>
      </div>

      {/* Drawing Status */}
      {isDrawing && (
        <div className="p-3 bg-accent-dark/20 rounded-lg">
          <p className="text-sm text-accent-dark font-medium">
            Drawing mode active
          </p>
          <p className="text-xs text-muted-foreground-dark mt-1">
            Click &quot;Select&quot; to return to normal mode
          </p>
        </div>
      )}
    </div>
  );
}
