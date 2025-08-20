"use client";

import { useState, useCallback } from "react";
import { cn } from "@/libraries/utils";
import { useCreateData, fontFamilies } from "../../../_providers";

interface TextToolsProps {
  canvasRef: React.MutableRefObject<any>;
  className?: string;
}

const TEXT_COLORS = [
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

const FONT_SIZES = [16, 20, 24, 28, 32, 36, 40, 48, 56, 64];

export default function TextTools({ canvasRef, className }: TextToolsProps) {
  const { fontFamily, setFontFamily } = useCreateData();
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedFontSize, setSelectedFontSize] = useState(32);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );

  const updateActiveTextObject = useCallback(
    (updates: any) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const activeObject = canvas.getActiveObject();

      if (activeObject && activeObject.type === "i-text") {
        Object.keys(updates).forEach((key) => {
          activeObject.set(key, updates[key]);
        });
        canvas.renderAll();
      }
    },
    [canvasRef]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      updateActiveTextObject({ fill: color });
    },
    [updateActiveTextObject]
  );

  const handleFontSizeChange = useCallback(
    (fontSize: number) => {
      setSelectedFontSize(fontSize);
      updateActiveTextObject({ fontSize });
    },
    [updateActiveTextObject]
  );

  const handleFontFamilyChange = useCallback(
    (fontFamilyOption: (typeof fontFamilies)[0]) => {
      setFontFamily(fontFamilyOption);
      updateActiveTextObject({ fontFamily: fontFamilyOption.value });
    },
    [setFontFamily, updateActiveTextObject]
  );

  const handleTextAlignChange = useCallback(
    (align: "left" | "center" | "right") => {
      setTextAlign(align);
      updateActiveTextObject({ textAlign: align });
    },
    [updateActiveTextObject]
  );

  const toggleBold = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      const currentWeight = activeObject.fontWeight;
      const newWeight = currentWeight === "bold" ? "normal" : "bold";
      activeObject.set("fontWeight", newWeight);
      canvas.renderAll();
    }
  }, [canvasRef]);

  const toggleItalic = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      const currentStyle = activeObject.fontStyle;
      const newStyle = currentStyle === "italic" ? "normal" : "italic";
      activeObject.set("fontStyle", newStyle);
      canvas.renderAll();
    }
  }, [canvasRef]);

  const addTextShadow = useCallback(() => {
    updateActiveTextObject({
      shadow: {
        color: "rgba(0,0,0,0.5)",
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      },
    });
  }, [updateActiveTextObject]);

  const removeTextShadow = useCallback(() => {
    updateActiveTextObject({ shadow: null });
  }, [updateActiveTextObject]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Font Family
        </label>
        <select
          value={fontFamily.label}
          onChange={(e) => {
            const selected = fontFamilies.find(
              (f) => f.label === e.target.value
            );
            if (selected) handleFontFamilyChange(selected);
          }}
          className="w-full p-2 bg-muted-dark text-white rounded border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
        >
          {fontFamilies.map((font) => (
            <option key={font.label} value={font.label}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Font Size
        </label>
        <select
          value={selectedFontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="w-full p-2 bg-muted-dark text-white rounded border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-dark"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Text Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {TEXT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={cn(
                "w-8 h-8 rounded border-2 transition-all",
                selectedColor === color
                  ? "border-accent-dark scale-110"
                  : "border-border-dark hover:border-accent-dark/50"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Text Alignment
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => handleTextAlignChange(align)}
              className={cn(
                "flex-1 py-2 px-3 text-sm rounded transition-colors",
                textAlign === align
                  ? "bg-accent-dark text-white"
                  : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
              )}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Text Style Options */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Text Style
        </label>
        <div className="flex gap-2">
          <button
            onClick={toggleBold}
            className="px-3 py-2 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors font-bold"
          >
            B
          </button>
          <button
            onClick={toggleItalic}
            className="px-3 py-2 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors italic"
          >
            I
          </button>
        </div>
      </div>

      {/* Text Effects */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Text Effects
        </label>
        <div className="flex gap-2">
          <button
            onClick={addTextShadow}
            className="px-3 py-2 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Add Shadow
          </button>
          <button
            onClick={removeTextShadow}
            className="px-3 py-2 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Remove Shadow
          </button>
        </div>
      </div>
    </div>
  );
}
