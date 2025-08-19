"use client";

import { useState, useCallback } from "react";
import { cn } from "@/libraries/utils";
import * as fabric from "fabric";

interface MediaToolsProps {
  canvasRef: React.MutableRefObject<any>;
  className?: string;
}

const FILTERS = [
  { name: "None", value: null },
  { name: "Grayscale", value: "grayscale" },
  { name: "Sepia", value: "sepia" },
  { name: "Vintage", value: "vintage" },
  { name: "Blur", value: "blur" },
  { name: "Sharpen", value: "sharpen" },
  { name: "Emboss", value: "emboss" },
];

export default function MediaTools({ canvasRef, className }: MediaToolsProps) {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("None");

  const getActiveImageObject = useCallback(() => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();

    return activeObject && activeObject.type === "image" ? activeObject : null;
  }, [canvasRef]);

  const applyImageFilters = useCallback(
    (filters: any[]) => {
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      imageObj.filters = filters;
      imageObj.applyFilters();
      canvasRef.current.renderAll();
    },
    [getActiveImageObject, canvasRef]
  );

  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightness(value);
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      const brightnessFilter = new fabric.filters.Brightness({
        brightness: value / 100,
      });

      const existingFilters =
        imageObj.filters?.filter(
          (f: any) => !(f instanceof fabric.filters.Brightness)
        ) || [];

      applyImageFilters([...existingFilters, brightnessFilter]);
    },
    [getActiveImageObject, applyImageFilters]
  );

  const handleContrastChange = useCallback(
    (value: number) => {
      setContrast(value);
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      const contrastFilter = new fabric.filters.Contrast({
        contrast: value / 100,
      });

      const existingFilters =
        imageObj.filters?.filter(
          (f: any) => !(f instanceof fabric.filters.Contrast)
        ) || [];

      applyImageFilters([...existingFilters, contrastFilter]);
    },
    [getActiveImageObject, applyImageFilters]
  );

  const handleSaturationChange = useCallback(
    (value: number) => {
      setSaturation(value);
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      const saturationFilter = new fabric.filters.Saturation({
        saturation: value / 100,
      });

      const existingFilters =
        imageObj.filters?.filter(
          (f: any) => !(f instanceof fabric.filters.Saturation)
        ) || [];

      applyImageFilters([...existingFilters, saturationFilter]);
    },
    [getActiveImageObject, applyImageFilters]
  );

  const applyFilter = useCallback(
    (filterName: string) => {
      setSelectedFilter(filterName);
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      let newFilter = null;

      switch (filterName) {
        case "grayscale":
          newFilter = new fabric.filters.Grayscale();
          break;
        case "sepia":
          newFilter = new fabric.filters.Sepia();
          break;
        case "vintage":
          // Vintage filter might not be available in v6, use sepia as fallback
          newFilter = new fabric.filters.Sepia();
          break;
        case "blur":
          newFilter = new fabric.filters.Blur({ blur: 0.1 });
          break;
        case "sharpen":
          newFilter = new fabric.filters.Convolute({
            matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
          });
          break;
        case "emboss":
          newFilter = new fabric.filters.Convolute({
            matrix: [-1, -1, 0, -1, 1, 1, 0, 1, 1],
          });
          break;
      }

      // Remove existing style filters but keep adjustment filters
      const existingFilters =
        imageObj.filters?.filter(
          (f: any) =>
            f instanceof fabric.filters.Brightness ||
            f instanceof fabric.filters.Contrast ||
            f instanceof fabric.filters.Saturation
        ) || [];

      if (newFilter) {
        applyImageFilters([...existingFilters, newFilter]);
      } else {
        applyImageFilters(existingFilters);
      }
    },
    [getActiveImageObject, applyImageFilters]
  );

  const resetFilters = useCallback(() => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSelectedFilter("None");
    applyImageFilters([]);
  }, [applyImageFilters]);

  const cropImage = useCallback(() => {
    const imageObj = getActiveImageObject();
    if (!imageObj) return;

    // Simple crop implementation - crop to current selection bounds
    const canvas = canvasRef.current;
    const scaleX = imageObj.scaleX || 1;
    const scaleY = imageObj.scaleY || 1;

    // Create a cropping rectangle
    const cropRect = new fabric.Rect({
      left: imageObj.left,
      top: imageObj.top,
      width: (imageObj.width || 0) * scaleX * 0.8,
      height: (imageObj.height || 0) * scaleY * 0.8,
      fill: "transparent",
      stroke: "#fff",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      originX: "center",
      originY: "center",
    });

    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();
  }, [getActiveImageObject, canvasRef]);

  const flipHorizontal = useCallback(() => {
    const imageObj = getActiveImageObject();
    if (!imageObj) return;

    imageObj.set("flipX", !imageObj.flipX);
    canvasRef.current.renderAll();
  }, [getActiveImageObject, canvasRef]);

  const flipVertical = useCallback(() => {
    const imageObj = getActiveImageObject();
    if (!imageObj) return;

    imageObj.set("flipY", !imageObj.flipY);
    canvasRef.current.renderAll();
  }, [getActiveImageObject, canvasRef]);

  const rotateImage = useCallback(
    (degrees: number) => {
      const imageObj = getActiveImageObject();
      if (!imageObj) return;

      const currentAngle = imageObj.angle || 0;
      imageObj.set("angle", currentAngle + degrees);
      canvasRef.current.renderAll();
    },
    [getActiveImageObject, canvasRef]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Adjustments */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Brightness
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full h-2 bg-muted-dark rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-muted-foreground-dark">
          {brightness}%
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Contrast
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => handleContrastChange(Number(e.target.value))}
          className="w-full h-2 bg-muted-dark rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-muted-foreground-dark">{contrast}%</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Saturation
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={saturation}
          onChange={(e) => handleSaturationChange(Number(e.target.value))}
          className="w-full h-2 bg-muted-dark rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-muted-foreground-dark">
          {saturation}%
        </span>
      </div>

      {/* Filters */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Filters
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.name}
              onClick={() => applyFilter(filter.value || "None")}
              className={cn(
                "py-2 px-3 text-sm rounded transition-colors",
                selectedFilter === filter.name
                  ? "bg-accent-dark text-white"
                  : "bg-muted-dark text-muted-foreground-dark hover:bg-muted-dark/80"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transform Tools */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Transform
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={flipHorizontal}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Flip H
          </button>
          <button
            onClick={flipVertical}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Flip V
          </button>
          <button
            onClick={() => rotateImage(90)}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Rotate 90°
          </button>
          <button
            onClick={() => rotateImage(-90)}
            className="py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Rotate -90°
          </button>
        </div>
      </div>

      {/* Advanced Tools */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground-dark mb-2">
          Advanced
        </label>
        <div className="space-y-2">
          <button
            onClick={cropImage}
            className="w-full py-2 px-3 bg-muted-dark text-white rounded hover:bg-muted-dark/80 transition-colors text-sm"
          >
            Add Crop Guide
          </button>
          <button
            onClick={resetFilters}
            className="w-full py-2 px-3 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors text-sm"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
