"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Input, type InputProps } from "@/components/ui/input";
import { Eye } from "@/components/icons";
import { styles } from "@/constants/clientConfig";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("hide-password-toggle pr-10", className)}
          ref={ref}
          {...props}
        />
        {props.value && props.value !== "" && !props.disabled ? (
          <Tooltip content={showPassword ? "Hide password" : "Show password"}>
            <button
              type="button"
              className={cn(
                "cursor-pointer",
                "absolute right-0 top-0",
                "h-full px-3 py-2",
                "text-card-foreground",
                "opacity-60 hover:opacity-90 hover:dark:opacity-100",
                "transition-opacity duration-200 ease-in-out",
                styles.focusVisible,
                "focus-visible:opacity-100 rounded-r-md"
              )}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Eye
                isOpen={showPassword}
                className="size-4"
                aria-hidden="true"
              />
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </Tooltip>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
