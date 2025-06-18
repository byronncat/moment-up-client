import * as React from "react";

import { cn } from "@/libraries/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // "text-base md:text-sm",
        "bg-input dark:bg-input/70",
        "min-h-16 w-full",
        "border-input placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "focus-visible:ring-[1px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "flex field-sizing-content",
        "rounded-md border px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
