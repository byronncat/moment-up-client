"use client";

import { useState } from "react";
import { useCreateData } from "../../_providers";
import { ContentPrivacy } from "@/constants/server";

import { cn } from "@/libraries/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Earth, Settings, User } from "@/components/icons";

const PrivacyOptions = [
  {
    label: "Public",
    value: ContentPrivacy.PUBLIC,
    icon: (className: string) => <Earth className={className} />,
    description: "Anyone can see your story",
  },
  {
    label: "Friends",
    value: ContentPrivacy.FOLLOWERS,
    icon: (className: string) => <User variant="check" className={className} />,
    description: "Only your friends can see your story",
  },
  {
    label: "Custom",
    value: ContentPrivacy.PRIVATE,
    icon: (className: string) => <User variant="plus" className={className} />,
    description: "Choose people to show your story to",
  },
];

type PrivacyDialogProps = Readonly<{
  disablePortal?: boolean;
  className?: string;
}>;

export default function PrivacyDialog({
  disablePortal = false,
  className,
}: PrivacyDialogProps) {
  const { privacy, setPrivacy } = useCreateData();
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setPrivacy(privacy);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleHideStoryFrom = () => {
    // TODO: Open dialog to select specific people to hide story from
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group",
            "p-2 rounded-full",
            "group hover:bg-accent-dark/12",
            "transition-colors duration-150 ease-in-out",
            "cursor-pointer focus-indicator-dark",
            className
          )}
        >
          <Settings
            className={cn(
              "size-5 text-muted-foreground-dark group-hover:text-white",
              "transition-colors duration-150 ease-in-out"
            )}
          />
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "w-[calc(100%-2rem)] max-w-[560px]",
          "bg-background-dark text-foreground-dark border-border-dark",
          "p-0 gap-0"
        )}
        disablePortal={disablePortal}
      >
        <DialogHeader className="pt-6 px-6 text-left gap-1">
          <DialogTitle className="text-base font-semibold text-white">
            Who can see your story?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground-dark">
            Your story will be visible for 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div>
            {PrivacyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPrivacy(option.value)}
                className={cn(
                  "w-full flex items-center gap-3",
                  "px-6 py-3",
                  "hover:bg-accent-dark/7",
                  "transition-colors duration-75 ease-in-out",
                  "cursor-pointer group focus-indicator-dark"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center shrink-0",
                    "size-12 rounded-full",
                    "bg-accent-dark/12 group-hover:bg-accent-dark/20",
                    "transition-colors duration-75 ease-in-out"
                  )}
                >
                  {option.icon("size-5.5 text-white")}
                </div>

                <div className="flex-1 text-left">
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-sm text-muted-foreground-dark">
                    {option.description}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-center shrink-0",
                    "size-5 rounded-full border-2",
                    privacy === option.value
                      ? "border-white/90"
                      : "border-muted-foreground-dark/50"
                  )}
                >
                  {privacy === option.value && (
                    <span
                      className={cn(
                        "size-3 rounded-full",
                        "bg-white/90 border border-transparent"
                      )}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleHideStoryFrom}
            className={cn(
              "w-full flex items-center gap-3",
              "px-6 py-3",
              "hover:bg-accent-dark/7",
              "transition-colors duration-75 ease-in-out",
              "cursor-pointer group focus-indicator-dark"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center shrink-0",
                "size-12 rounded-full",
                "bg-accent-dark/12 group-hover:bg-accent-dark/20"
              )}
            >
              <User variant="minus" className="size-5.5 text-white" />
            </div>

            <div className="flex-1 text-left">
              <span className="text-base font-medium text-white">
                Hide Story From
              </span>
            </div>
            <svg
              className="size-5 text-muted-foreground-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <DialogFooter
          className={cn("px-6 pt-6 pb-4", "flex-row justify-end gap-2")}
        >
          <DialogClose asChild>
            <button
              onClick={handleCancel}
              className={cn(
                "cursor-pointer",
                "inline-flex items-center justify-center gap-2",
                "whitespace-nowrap rounded-md",
                "text-sm fond-semibold",
                "transition-colors duration-200 ease-in-out",
                "focus-indicator-dark",
                "disabled:pointer-events-none disabled:opacity-50",
                "h-10 w-20 py-2",
                "hover:bg-accent/10 hover:text-accent-foreground"
              )}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleSave}
            className={cn(
              "cursor-pointer",
              "inline-flex items-center justify-center gap-2",
              "whitespace-nowrap rounded-md",
              "text-sm font-semibold",
              "transition-colors duration-200 ease-in-out",
              "focus-indicator-dark",
              "disabled:pointer-events-none disabled:opacity-50",
              "h-10 w-20 py-2",
              "bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary"
            )}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
