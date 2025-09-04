import * as React from "react";
import clsx from "clsx";

import { cn } from "@/libraries/utils";
import { styles } from "@/constants/client";

export type InputProps = React.ComponentProps<"input">;
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          clsx(
            "text-sm",
            "bg-input rounded-md border border-border",
            "flex w-full px-3 py-1",
            "shadow-xs transition-colors",
            "placeholder:text-muted-foreground",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            styles.focusVisible,
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
