"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as fabric from "fabric";
import { cn } from "@/libraries/utils";
import { useCreateData, useCanvas } from "../../_provider";

interface FabricCanvasProps {
  className?: string;
}

export type { fabric };

export default function FabricCanvas({ className }: FabricCanvasProps) {
  const { type, fontFamily, uploadedMedia, setTextContent } = useCreateData();
  const { setCanvas } = useCanvas();

  // Separate refs for canvas and fabric canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Initialize FabricJS canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const aspectRatio = 9 / 16;
    let canvasWidth = containerRect.width;
    let canvasHeight = containerRect.height;

    if (canvasWidth / canvasHeight > aspectRatio)
      canvasWidth = canvasHeight * aspectRatio;
    else canvasHeight = canvasWidth / aspectRatio;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: true,
    });

    // Render all objects when one is modified
    canvas.on("object:modified", () => {
      canvas.renderAll();
    });

    // Handle text content changes
    canvas.on("text:changed", (event: { target: fabric.IText }) => {
      const target = event.target;
      if (target && target.text) setTextContent(target.text);
    });

    fabricCanvasRef.current = canvas;

    // Notify parent component that canvas is ready
    setIsCanvasReady(true);
    setCanvas(canvas);

    const handleResize = () => {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const aspectRatio = 9 / 16;
      let canvasWidth = containerRect.width;
      let canvasHeight = containerRect.height;

      if (canvasWidth / canvasHeight > aspectRatio)
        canvasWidth = canvasHeight * aspectRatio;
      else canvasHeight = canvasWidth / aspectRatio;

      canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, [setTextContent, setCanvas]);

  // Handle media uploads
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReady || !uploadedMedia) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();

    if (type === "image") {
      fabric.FabricImage.fromURL(uploadedMedia.preview).then(
        (image: fabric.FabricImage) => {
          // Scale image to fit canvas while maintaining aspect ratio
          const scaleX = canvas.width! / image.width!;
          const scaleY = canvas.height! / image.height!;
          const scale = Math.min(scaleX, scaleY);

          image.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
            selectable: true,

            // Set control styles
            borderColor: "#000",
            cornerColor: "#000",
            cornerStrokeColor: "#fff",
            transparentCorners: false,
            cornerStyle: "circle",
          });

          canvas.add(image);
          canvas.renderAll();
        }
      );
    }

    if (type === "video") {
      // Create video element
      const videoElement = document.createElement("video");
      videoElement.src = uploadedMedia.preview;
      videoElement.crossOrigin = "anonymous";
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.controls = false;
      videoElement.preload = "metadata";

      let videoAdded = false;
      const handleVideoLoad = () => {
        if (videoAdded) return;
        if (!videoElement.videoWidth || !videoElement.videoHeight) return;

        try {
          videoAdded = true;

          // Start video playback
          videoElement
            .play()
            .then(() => {
              // Create a canvas to draw video frames
              const videoCanvas = document.createElement("canvas");
              videoCanvas.width = videoElement.videoWidth;
              videoCanvas.height = videoElement.videoHeight;
              const videoCtx = videoCanvas.getContext("2d")!;

              // Draw first frame
              videoCtx.drawImage(videoElement, 0, 0);

              // Create fabric image from the video canvas
              fabric.FabricImage.fromURL(videoCanvas.toDataURL())
                .then((fabricImage: fabric.FabricImage) => {
                  // Scale to fit canvas
                  const scaleX = canvas.width! / videoElement.videoWidth;
                  const scaleY = canvas.height! / videoElement.videoHeight;
                  const scale = Math.min(scaleX, scaleY);

                  fabricImage.set({
                    left: canvas.width! / 2,
                    top: canvas.height! / 2,
                    originX: "center",
                    originY: "center",
                    scaleX: scale,
                    scaleY: scale,
                    selectable: true,

                    // Set control styles
                    borderColor: "#000",
                    cornerColor: "#000",
                    cornerStrokeColor: "#fff",
                    transparentCorners: false,
                    cornerStyle: "circle",
                  });

                  canvas.add(fabricImage);
                  canvas.renderAll();

                  // Continuously update the fabric image with video frames
                  const updateFrame = () => {
                    if (
                      canvas &&
                      !(canvas as any).disposed &&
                      !videoElement.paused
                    ) {
                      videoCtx.drawImage(videoElement, 0, 0);
                      const imageData = videoCanvas.toDataURL();

                      // Update the fabric image source
                      const img = new Image();
                      img.onload = () => {
                        (fabricImage as any).setElement(img);
                        canvas.renderAll();
                      };
                      img.src = imageData;

                      requestAnimationFrame(updateFrame);
                    }
                  };

                  updateFrame();
                })
                .catch((error) => {
                  console.error(
                    "Error creating fabric image from video canvas:",
                    error
                  );
                });
            })
            .catch((error) => {
              console.error("Error starting video playback:", error);
            });
        } catch (error) {
          console.error("Error processing video:", error);
        }
      };

      videoElement.addEventListener("canplay", handleVideoLoad, { once: true });
      videoElement.load();
    }
  }, [uploadedMedia, type, isCanvasReady]);

  const addText = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const text = new fabric.IText("Add text here", {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: "center",
      originY: "center",
      fontFamily: fontFamily.value,
      fontSize: 24,
      fill: "white",
      textAlign: "center",
      editable: true,
      selectable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [fontFamily]);

  const addShape = useCallback((shapeType: "circle" | "rectangle") => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    let shape: fabric.Object;

    if (shapeType === "circle") {
      shape = new fabric.Circle({
        radius: 50,
        fill: "rgba(255, 255, 255, 0.3)",
        stroke: "white",
        strokeWidth: 2,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: "center",
        originY: "center",
      });
    } else {
      shape = new fabric.Rect({
        width: 100,
        height: 60,
        fill: "rgba(255, 255, 255, 0.3)",
        stroke: "white",
        strokeWidth: 2,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: "center",
        originY: "center",
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }, []);

  const exportCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return null;

    return fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // Higher resolution export
    });
  }, []);

  // Store methods on the canvas ref for external access
  useEffect(() => {
    if (isCanvasReady && fabricCanvasRef.current) {
      (fabricCanvasRef.current as any).addText = addText;
      (fabricCanvasRef.current as any).addShape = addShape;
      (fabricCanvasRef.current as any).deleteSelected = deleteSelected;
      (fabricCanvasRef.current as any).exportCanvas = exportCanvas;
    }
  }, [isCanvasReady, addText, addShape, deleteSelected, exportCanvas]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <canvas ref={canvasRef} className="max-w-full max-h-full" />
    </div>
  );
}
