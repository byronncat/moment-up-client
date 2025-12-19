"use client";

import { forwardRef, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Input, type InputProps } from "@/components/ui/input";
import { Eye } from "@/components/icons";
import { Keyboard } from "lucide-react";

const prClass = {
  capsLock: "3",
  eye: "pr-10",
  both: "pr-16",
  none: null,
};

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, onKeyDown, onKeyUp, onFocus, onBlur, ...props }, ref) => {
    const t = useTranslations("PasswordInput");
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    function handleKeyEvent(event: React.KeyboardEvent<HTMLInputElement>) {
      setCapsLockOn(event.getModifierState("CapsLock"));
    }

    const showCapsLock = capsLockOn && !showPassword && isFocused;
    const showEyeButton = props.value && props.value !== "" && !props.disabled;

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            prClass[
              showCapsLock && showEyeButton
                ? "both"
                : showCapsLock
                  ? "capsLock"
                  : showEyeButton
                    ? "eye"
                    : "none"
            ],
            className
          )}
          ref={ref}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={(event) => {
            handleKeyEvent(event);
            onKeyDown?.(event);
          }}
          onKeyUp={(event) => {
            handleKeyEvent(event);
            onKeyUp?.(event);
          }}
          {...props}
        />

        <Tooltip
          open={showCapsLock}
          side="top"
          sideOffset={8}
          content={t("capsLock")}
        >
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              "transition-opacity duration-150",
              showEyeButton ? "right-10" : "right-3",
              showCapsLock ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Keyboard className="size-4 text-white" aria-hidden="true" />
          </div>
        </Tooltip>

        {showEyeButton ? (
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
                "focus-within-indicator focus-visible:opacity-100 rounded-r-md"
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
