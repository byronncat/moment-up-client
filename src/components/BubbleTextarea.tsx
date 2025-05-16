import { cn } from "@/libraries/utils";
import { Textarea } from "./ui/textarea";

interface BubbleTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export default function BubbleTextarea({
  value,
  onChange,
  placeholder = "Share a thought...",
  maxLength = 60,
  className,
}: BubbleTextareaProps) {
  const charCount = value.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) onChange(newValue);
  };

  return (
    <div className={className}>
      <div className="relative h-36">
        <Textarea
          value={value}
          rows={3}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "bg-card",
            "focus-visible:!ring-0 !border-none",
            "h-full py-4 px-5 rounded-2xl",
            "resize-none",
            "text-lg",
            "transition-all duration-200"
          )}
          maxLength={maxLength}
        />

        <span
          className={cn(
            "text-muted-foreground",
            "absolute bottom-2 right-3",
            "flex items-center justify-center",
            "text-xs font-medium",
            charCount === maxLength && "text-red-500 dark:text-red-300"
          )}
        >
          {charCount}/{maxLength}
        </span>
      </div>

      <Bubble />
    </div>
  );
}

function Bubble() {
  return (
    <div className={cn("flex flex-col w-full", "overflow-hidden pb-2")}>
      <Circle className="ml-11 -mt-4 size-8" />
      <Circle className="ml-18 mt-1 size-3" />
      <Circle className="ml-24 mt-1 size-2" />
    </div>
  );
}

function Circle({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn("rounded-full bg-card", "z-10 shadow-xs", className)}
    ></div>
  );
}
