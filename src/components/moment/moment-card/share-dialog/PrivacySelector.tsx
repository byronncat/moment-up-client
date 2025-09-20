import type { ContentPrivacy } from "@/constants/server";
import { PRIVACY_OPTIONS } from "./shareDialog.constant";

import { cn } from "@/libraries/utils";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Chevron, User } from "../../../icons";
import MenuItem from "../../../common/MenuItem";

type PrivacySelectorProps = Readonly<{
  selectedPrivacy: ContentPrivacy;
  onPrivacyChange: (privacy: ContentPrivacy) => void;
}>;

export default function PrivacySelector({
  selectedPrivacy,
  onPrivacyChange,
}: PrivacySelectorProps) {
  const selectedOption = PRIVACY_OPTIONS.find(
    (opt) => opt.value === selectedPrivacy
  );

  const openIncludeDialog = () => {
    // TODO: Open dialog to select specific people to include
  };

  const openExcludeDialog = () => {
    // TODO: Open dialog to select specific people to exclude
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "px-2 h-7",
            "text-xs font-medium",
            "flex items-center gap-1.5",
            "text-muted-foreground"
          )}
        >
          {selectedOption?.icon}
          {selectedOption?.label}
          <Chevron direction="down" className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-64">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Select privacy
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {PRIVACY_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "flex items-center gap-3",
                "p-2 h-auto",
                "cursor-pointer"
              )}
              onClick={() => onPrivacyChange(option.value)}
            >
              <MenuItem
                icon={option.icon}
                label={option.label}
                description={option.description}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Advanced options (coming soon)
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
              label="Include specific people (coming soon)"
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
              label="Exclude specific people (coming soon)"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
