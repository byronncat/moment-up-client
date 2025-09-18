import { useState } from "react";
import { usePostData } from "../../_provider/PostData";
import { Privacy } from "@/constants/server";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { MenuItem, useFocusTrap } from "@/components/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Chevron, Globe, Lock, User } from "@/components/icons";

const PrivacyOptions = [
  {
    label: "Public",
    value: Privacy.PUBLIC,
    icon: (className: string) => <Globe className={className} />,
    description: "Anyone can see this",
  },
  {
    label: "Followers",
    value: Privacy.FOLLOWERS,
    icon: (className: string) => <User variant="check" className={className} />,
    description: "People who follow you",
  },
  {
    label: "Friends",
    value: Privacy.FRIENDS,
    icon: (className: string) => <User multiple className={className} />,
    description: "Only your friends",
  },
  {
    label: "Private",
    value: Privacy.PRIVATE,
    icon: (className: string) => <Lock className={className} />,
    description: "Only you can see this",
  },
];

export default function PrivacySelector() {
  const { setFocusTrapEnabled } = useFocusTrap();
  const { privacy, setPrivacy } = usePostData();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = PrivacyOptions.find((opt) => opt.value === privacy);

  const openIncludeDialog = () => {
    // TODO: Open dialog to select specific people to include
  };

  const openExcludeDialog = () => {
    // TODO: Open dialog to select specific people to exclude
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setFocusTrapEnabled(!open);
        setTimeout(() => {
          setIsOpen(open);
        }, 0);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "px-2 h-6 w-[112px]",
            "text-xs font-medium",
            "flex items-center gap-1",
            "text-muted-foreground focus-visible:text-accent-foreground"
          )}
        >
          {selectedOption?.icon("size-3")}
          {selectedOption?.label}
          <Chevron direction="down" className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-64">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Select privacy
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {PrivacyOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "flex items-center gap-3",
                "p-2 h-auto",
                "cursor-pointer"
              )}
              onClick={() => setPrivacy(option.value)}
            >
              <MenuItem
                icon={option.icon("size-4")}
                label={option.label}
                description={option.description}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Advanced options
          </DropdownMenuLabel>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-3",
              "p-2 h-auto",
              "cursor-pointer"
            )}
            onClick={openIncludeDialog}
          >
            <MenuItem
              icon={<User variant="plus" className="size-4" />}
              label="Include specific people"
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-3",
              "p-2 h-auto",
              "cursor-pointer"
            )}
            onClick={openExcludeDialog}
          >
            <MenuItem
              icon={<User variant="minus" className="size-4" />}
              label="Exclude specific people"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
