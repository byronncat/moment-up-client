import { useCreateData } from "../../_providers";
import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextBackground } from "@/constants/clientConfig";

export default function BackgroundSelector({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { selectedBackground, setSelectedBackground: onSelectBackground } =
    useCreateData();

  return (
    <div className={cn("border border-accent-dark/20 rounded-lg", className)}>
      <ScrollArea thumbClassName="bg-accent-dark/30" className="h-full">
        <div
          className={cn(
            "py-3",
            "mx-auto w-max", // Grid justification issue
            "grid grid-cols-7 gap-3"
          )}
        >
          {TextBackground.map((background, index) =>
            selectedBackground === index ? (
              <div
                key={index}
                className={cn(
                  "bg-white size-8",
                  "rounded-full flex items-center justify-center"
                )}
              >
                <div
                  className={cn("size-7 rounded-full", "cursor-pointer")}
                  style={background}
                  onClick={() => onSelectBackground(index)}
                />
              </div>
            ) : (
              <div
                key={index}
                className={cn("size-8 rounded-full", "cursor-pointer")}
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
