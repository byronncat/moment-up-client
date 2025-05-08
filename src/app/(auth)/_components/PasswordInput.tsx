"use client";

import type { InputProps } from "@/components/ui/input";

import { forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
            {showPassword ? (
              <EyeIcon className="size-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="size-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
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
