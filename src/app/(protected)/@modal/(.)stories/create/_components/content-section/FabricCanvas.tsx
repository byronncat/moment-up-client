"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { cn } from "@/libraries/utils";
import { useCanvas, useCreateData } from "../../_providers";
import { ControlStyles, CursorStyles, PositionStyles } from "../../_constants";
import TextEditPopup from "../TextEditPopup";

interface FabricCanvasProps {
  className?: string;
}

// WeakMap to generate stable unique IDs for text objects
const textObjectIdMap = new WeakMap<fabric.FabricObject, number>();
let nextObjectId = 0;

function getTextObjectId(obj: fabric.FabricObject): number {
  if (!textObjectIdMap.has(obj)) {
    textObjectIdMap.set(obj, nextObjectId++);
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return textObjectIdMap.get(obj)!;
}

export default function FabricCanvas({ className }: FabricCanvasProps) {
  const { type, uploadedMedia, setTextContent } = useCreateData();
  const { selectedObject, setCanvas, setSelectedObject, updateSelectedText } =
    useCanvas();

  // Separate refs for canvas and fabric canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const isCanvasReadyRef = useRef(false);

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
      ...CursorStyles,
    });

    // Render all objects when one is modified
    canvas.on("object:modified", () => {
      canvas.renderAll();
    });

    // Handle text content changes
    canvas.on("text:changed", (event: { target: fabric.IText }) => {
      const { target } = event;
      if (target?.text) setTextContent(target.text);
    });

    // Handle object selection
    canvas.on(
      "selection:created",
      (event: { selected: fabric.FabricObject[] }) => {
        if (event.selected?.length === 1)
          setSelectedObject(event.selected[0]);
      }
    );

    canvas.on(
      "selection:updated",
      (event: { selected: fabric.FabricObject[] }) => {
        if (event.selected?.length === 1)
          setSelectedObject(event.selected[0]);
        else setSelectedObject(null);
      }
    );

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    fabricCanvasRef.current = canvas;

    // Notify parent component that canvas is ready
    isCanvasReadyRef.current = true;
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
      isCanvasReadyRef.current = false;
    };
  }, [setTextContent, setCanvas, setSelectedObject]);

  // Handle media uploads
  useEffect(() => {
    if (!fabricCanvasRef.current || !isCanvasReadyRef.current || !uploadedMedia) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();

    if (type === "image") {
      fabric.FabricImage.fromURL(uploadedMedia.preview).then(
        (image: fabric.FabricImage) => {
          // Scale image to fit canvas while maintaining aspect ratio
          const scaleX = canvas.width / image.width;
          const scaleY = canvas.height / image.height;
          const scale = Math.min(scaleX, scaleY);

          image.set({
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            ...ControlStyles,
            ...PositionStyles(canvas.width, canvas.height),
          });

          canvas.add(image);
          canvas.renderAll();
        }
      );
    }

    // @deprecated
    // if (type === "video") {
    //   // Create video element
    //   const videoElement = document.createElement("video");
    //   videoElement.src = uploadedMedia.preview;
    //   videoElement.crossOrigin = "anonymous";
    //   videoElement.muted = true;
    //   videoElement.loop = true;
    //   videoElement.controls = false;
    //   videoElement.preload = "metadata";

    //   let videoAdded = false;
    //   const handleVideoLoad = () => {
    //     if (videoAdded) return;
    //     if (!videoElement.videoWidth || !videoElement.videoHeight) return;

    //     try {
    //       videoAdded = true;

    //       // Start video playback
    //       videoElement
    //         .play()
    //         .then(() => {
    //           // Create a canvas to draw video frames
    //           const videoCanvas = document.createElement("canvas");
    //           videoCanvas.width = videoElement.videoWidth;
    //           videoCanvas.height = videoElement.videoHeight;
    //           const videoCtx = videoCanvas.getContext("2d")!;

    //           // Draw first frame
    //           videoCtx.drawImage(videoElement, 0, 0);

    //           // Create fabric image from the video canvas
    //           fabric.FabricImage.fromURL(videoCanvas.toDataURL())
    //             .then((fabricImage: fabric.FabricImage) => {
    //               // Scale to fit canvas
    //               const scaleX = canvas.width! / videoElement.videoWidth;
    //               const scaleY = canvas.height! / videoElement.videoHeight;
    //               const scale = Math.min(scaleX, scaleY);

    //               fabricImage.set({
    //                 scaleX: scale,
    //                 scaleY: scale,
    //                 selectable: true,
    //                 ...ControlStyles,
    //                 ...PositionStyles(canvas.width, canvas.height),
    //               });

    //               canvas.add(fabricImage);
    //               canvas.renderAll();

    //               // Continuously update the fabric image with video frames
    //               const updateFrame = () => {
    //                 if (
    //                   canvas &&
    //                   !(canvas as any).disposed &&
    //                   !videoElement.paused
    //                 ) {
    //                   videoCtx.drawImage(videoElement, 0, 0);
    //                   const imageData = videoCanvas.toDataURL();

    //                   // Update the fabric image source
    //                   const img = new Image();
    //                   img.onload = () => {
    //                     (fabricImage as any).setElement(img);
    //                     canvas.renderAll();
    //                   };
    //                   img.src = imageData;

    //                   requestAnimationFrame(updateFrame);
    //                 }
    //               };

    //               updateFrame();
    //             })
    //             .catch((error) => {
    //               console.error(
    //                 "Error creating fabric image from video canvas:",
    //                 error
    //               );
    //             });
    //         })
    //         .catch((error) => {
    //           console.error("Error starting video playback:", error);
    //         });
    //     } catch (error) {
    //       console.error("Error processing video:", error);
    //     }
    //   };

    //   videoElement.addEventListener("canplay", handleVideoLoad, { once: true });
    //   videoElement.load();
    // }
  }, [uploadedMedia, type]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <canvas ref={canvasRef} className="max-w-full max-h-full" />
      {selectedObject && selectedObject instanceof fabric.IText ? (
        <TextEditPopup
          key={`text-popup-${getTextObjectId(selectedObject)}`}
          selectedObject={selectedObject as fabric.IText}
          onUpdateText={updateSelectedText}
        />
      ) : null}
    </div>
  );
}
