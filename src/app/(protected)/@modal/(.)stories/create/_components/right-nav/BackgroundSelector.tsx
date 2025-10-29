/* eslint-disable react/no-array-index-key */

import { useCreateData } from "../../_providers";
import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextBackground } from "@/constants/client";

export default function BackgroundSelector({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { selectedBackground, setSelectedBackground: onSelectBackground } =
    useCreateData();

  return (
    <div
      className={cn(
        "border border-accent-dark/20",
        "bg-input-dark rounded-lg",
        className
      )}
    >
      <ScrollArea thumbClassName="bg-accent-dark/30" className="h-full">
        <div
          className={cn("p-3 mx-auto max-w-[348px]", "grid grid-cols-7 gap-3")}
        >
          {TextBackground.map((background, index) =>
            selectedBackground === index ? (
              <div
                key={index}
                className={cn(
                  "bg-white aspect-square",
                  "rounded-full flex items-center justify-center"
                )}
              >
                <div
                  className={cn(
                    "w-[90%] aspect-square rounded-full",
                    "cursor-pointer"
                  )}
                  style={background}
                  onClick={() => onSelectBackground(index)}
                />
              </div>
            ) : (
              <div
                key={index}
                className={cn(
                  "grow aspect-square rounded-full",
                  "cursor-pointer"
                )}
                style={background}
                onClick={() => onSelectBackground(index)}
              />
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
