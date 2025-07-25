import { Audience } from "@/constants/serverConfig";
import { AUDIENCE_OPTIONS } from "./shareDialog.constant";

import { cn } from "@/libraries/utils";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../../ui/dropdown-menu";
import { User, Chevron } from "../../../icons";
import MenuItem from "./MenuItem";

type AudienceSelectorProps = Readonly<{
  selectedAudience: Audience;
  onAudienceChange: (audience: Audience) => void;
}>;

export default function AudienceSelector({
  selectedAudience,
  onAudienceChange,
}: AudienceSelectorProps) {
  const selectedOption = AUDIENCE_OPTIONS.find(
    (opt) => opt.value === selectedAudience
  );

  const openIncludeDialog = () => {
    // TODO: Open dialog to select specific people to include
    console.log("Opening include people dialog");
  };

  const openExcludeDialog = () => {
    // TODO: Open dialog to select specific people to exclude
    console.log("Opening exclude people dialog");
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
          Select audience
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {AUDIENCE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "flex items-center gap-3",
                "p-2 h-auto",
                "cursor-pointer"
              )}
              onClick={() => onAudienceChange(option.value)}
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
