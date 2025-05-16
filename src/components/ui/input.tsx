import * as React from "react";
import clsx from "clsx";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          clsx(
            "flex w-full",
            "rounded-md border border-border bg-input",
            "px-3 py-1",
            "text-base md:text-sm",
            "shadow-xs",
            "transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50"
          ),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
