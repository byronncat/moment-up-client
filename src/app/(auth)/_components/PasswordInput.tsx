"use client";

import type { InputProps } from "@/components/ui/input";

import { forwardRef, useState } from "react";
import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Input } from "@/components/ui/input";
import { Eye } from "@/components/icons";

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
        {props.value && props.value !== "" && !props.disabled && (
          <Tooltip content={showPassword ? "Hide password" : "Show password"}>
            <button
              type="button"
              className={cn(
                "cursor-pointer",
                "absolute right-0 top-0",
                "h-full px-3 py-2",
                "text-card-foreground",
                "opacity-60 hover:opacity-90 hover:dark:opacity-100 transition-opacity duration-200 ease-in-out"
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
        )}
        <style>{`
          .hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
