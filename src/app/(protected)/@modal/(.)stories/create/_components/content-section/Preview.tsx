import { useCreateData } from "../../_providers";
import { cn } from "@/libraries/utils";
import { Eye } from "@/components/icons";
import { TextBackground } from "@/constants/clientConfig";
import FabricCanvas from "./FabricCanvas";

export default function Preview() {
  const {
    type,
    textContent,
    fontFamily,
    selectedBackground,
    uploadedMedia,
    setTextContent,
  } = useCreateData();

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
    setTextContent(element.value);
  }

  return (
    <div className={cn("size-full", "flex items-center justify-center")}>
      <div
        className={cn(
          "max-w-[80vh] w-full h-fit",
          "p-4 bg-card-dark rounded-lg"
        )}
      >
        <div
          className={cn(
            "mb-4",
            "text-white font-semibold",
            "flex items-center gap-2"
          )}
        >
          <Eye isOpen className="size-4 " />
          <span>Preview</span>
        </div>

        <div
          className={cn(
            "p-3",
            "max-w-[80vh] w-full aspect-square",
            "bg-muted-dark rounded-lg",
            "flex items-center justify-center"
          )}
        >
          <div
            className={cn(
              "size-full max-w-[calc(100%*9/16)] rounded-lg overflow-hidden",
              "flex items-center justify-center relative"
            )}
            style={type === "text" ? TextBackground[selectedBackground] : {}}
          >
            {type === "text" && (
              <textarea
                className={cn(
                  "px-5 h-auto w-full",
                  "text-white caret-white placeholder:text-white/[.7]",
                  "text-2xl font-semibold",
                  "focus:outline-none text-center",
                  "resize-none bg-transparent"
                )}
                style={{ fontFamily: fontFamily.value }}
                placeholder="Start typing"
                value={textContent}
                onChange={handleInputChange}
              />
            )}

            {(type === "image" || type === "video") && uploadedMedia && (
              <FabricCanvas className="size-full bg-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
