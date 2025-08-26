"use client";

import type { TextStyleUpdate } from "../_providers/Canvas";

import { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Font, TextColors } from "../_constants";

import { cn } from "@/libraries/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum FontSize {
  MIN = 12,
  MAX = 72,
  STEP = 2,
}

type TextEditPopupProps = {
  selectedObject: fabric.IText | null;
  onUpdateText: (updates: TextStyleUpdate) => void;
};

export default function TextEditPopup({
  selectedObject,
  onUpdateText,
}: TextEditPopupProps) {
  const [selectedFontFamily, setSelectedFontFamily] = useState(Font[0]);
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState(TextColors[0]);

  const handleFontChange = (fontLabel: string) => {
    const font = Font.find((f) => f.label === fontLabel);
    if (font) {
      setSelectedFontFamily(font);
      onUpdateText({ fontFamily: font.family });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onUpdateText({ fill: color });
  };

  useEffect(() => {
    if (selectedObject) {
      const currentFont =
        Font.find((f) => f.family === selectedObject.fontFamily) || Font[0];
      setSelectedFontFamily(currentFont);
      setSelectedColor((selectedObject.fill as string) || TextColors[0]);
      setSelectedFontSize(selectedObject.fontSize || 24);
    }
  }, [selectedObject]);

  if (!selectedObject) return null;
  return (
    <div
      className={cn(
        "absolute top-0 left-[calc(100%+1rem)] z-10",
        "bg-card-dark rounded-lg",
        "border border-border-dark",
        "p-3 pb-5 w-[260px]"
      )}
    >
      <div className="w-full">
        <Select
          value={selectedFontFamily.label}
          onValueChange={handleFontChange}
        >
          <SelectTrigger
            className={cn(
              "w-full !bg-muted-dark text-card-foreground-dark",
              "border-accent-dark/10",
              "[&_svg]:!text-muted-foreground-dark"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground-dark">
                Aa
              </span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-muted-dark border-border-dark">
            {Font.map((font) => (
              <SelectItem
                key={font.value}
                value={font.label}
                className={cn(
                  "cursor-pointer",
                  "!text-card-foreground-dark focus:!bg-accent-dark/10",
                  "[&_svg]:!text-muted-foreground-dark"
                )}
              >
                <span>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={selectedFontSize.toFixed(1)}
          onChange={(event) => {
            const newValue = parseFloat(event.target.value) || 0;
            const clampedValue = Math.min(FontSize.MAX, Math.max(FontSize.MIN, newValue));
            setSelectedFontSize(clampedValue);
            onUpdateText({ fontSize: clampedValue });
          }}
          min={FontSize.MIN}
          max={FontSize.MAX}
          step={FontSize.STEP}
          className={cn(
            "text-xs text-foreground-dark mt-1",
            "h-9 bg-muted-dark",
            "border-border-dark",
            "focus-visible:ring-accent-dark/50 focus-visible:border-accent-dark/50 focus-visible:ring-0.5"
          )}
        />

        <div
          className={cn(
            "p-2 mt-3",
            "rounded-md border border-accent-dark/[.16]"
          )}
        >
          <div className="grid grid-cols-7 gap-2">
            {TextColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`aspect-square rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-white scale-110"
                    : "border-gray-600 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
