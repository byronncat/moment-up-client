"use client";

import type { TextStyleUpdate } from "../_providers/Canvas";
import type * as fabric from "fabric";

import { useMemo, useState } from "react";
import { Font, FontSize, TextColors } from "../_constants";

import { cn } from "@/libraries/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TextEditPopupProps = Readonly<{
  selectedObject: fabric.IText | null;
  onUpdateText: (updates: TextStyleUpdate) => void;
  className?: string;
}>;

export default function TextEditPopup({
  selectedObject,
  onUpdateText,
  className,
}: TextEditPopupProps) {
  const initialValues = useMemo(() => {
    if (!selectedObject) {
      return {
        font: Font[0],
        color: TextColors[0],
        fontSize: 24,
      };
    }
    return {
      font: Font.find((f) => f.family === selectedObject.fontFamily) ?? Font[0],
      color: (selectedObject.fill as string) || TextColors[0],
      fontSize: selectedObject.fontSize || 24,
    };
  }, [selectedObject]);

  const [selectedFontFamily, setSelectedFontFamily] = useState(
    initialValues.font
  );
  const [selectedFontSize, setSelectedFontSize] = useState(
    initialValues.fontSize
  );
  const [selectedColor, setSelectedColor] = useState(initialValues.color);

  function handleFontChange(fontLabel: string) {
    const font = Font.find((f) => f.label === fontLabel);
    if (font) {
      setSelectedFontFamily(font);
      onUpdateText({ fontFamily: font.family });
    }
  }

  function handleFontSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseFloat(event.target.value) || 0;
    const clampedValue = Math.min(
      FontSize.MAX,
      Math.max(FontSize.MIN, newValue)
    );
    setSelectedFontSize(clampedValue);
    onUpdateText({ fontSize: clampedValue });
  }

  function handleColorChange(color: string) {
    setSelectedColor(color);
    onUpdateText({ fill: color });
  }

  if (!selectedObject) return null;
  return (
    <div
      className={cn(
        "bg-card-dark rounded-lg",
        "border border-border-dark",
        "p-3 pb-5 w-[260px]",
        className
      )}
    >
      <Select value={selectedFontFamily.label} onValueChange={handleFontChange}>
        <SelectTrigger
          className={cn(
            "w-full bg-input-dark text-foreground-dark",
            "border-accent-dark/10",
            "[&_svg]:text-white!"
          )}
        >
          <div className="flex items-baseline gap-2">
            <span
              className={cn("w-5", "font-semibold text-muted-foreground-dark")}
            >
              Aa
            </span>
            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-input-dark border-border-dark">
          {Font.map((font) => (
            <SelectItem
              key={font.value}
              value={font.label}
              className={cn(
                "cursor-pointer",
                "text-foreground-dark focus:text-foreground-dark hover:bg-accent-dark/10",
                "transition-colors duration-75 ease-in-out",
                "[&_svg]:text-white!"
              )}
            >
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-1 w-full h-9 relative">
        <Input
          type="number"
          value={selectedFontSize.toFixed(1)}
          onChange={handleFontSizeChange}
          min={FontSize.MIN}
          max={FontSize.MAX}
          step={FontSize.STEP}
          className={cn(
            "pl-10 text-foreground-dark",
            "size-full bg-input-dark",
            "border-border-dark",
            "focus-visible:ring-accent-dark/50 focus-visible:border-accent-dark/50 focus-visible:ring-0.5"
          )}
        />
        <span
          className={cn(
            "font-semibold text-muted-foreground-dark text-sm",
            "absolute top-1/2 -translate-y-1/2 left-4"
          )}
        >
          A+
        </span>
      </div>

      <div
        className={cn(
          "p-2 mt-3",
          "rounded-md bg-input-dark",
          "border border-accent-dark/16"
        )}
      >
        <div className="grid grid-cols-7 gap-2">
          {TextColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={cn(
                "cursor-pointer",
                "aspect-square rounded-full border-2",
                "transition-all duration-75 ease-in-out",
                selectedColor === color
                  ? "border-white scale-110"
                  : "border-accent-dark/16 hover:border-white hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
