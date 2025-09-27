import { useComment } from "@/components/providers";
import { SortBy } from "@/constants/client";

import { cn } from "@/libraries/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Chevron } from "@/components/icons";

const sortOptions = [
  {
    value: SortBy.MOST_LIKED,
    label: "Most liked",
    description: "Prioritize with the most likes.",
  },
  {
    value: SortBy.NEWEST,
    label: "Newest",
    description: "Show the most recent at the top.",
  },
];

export default function SortButton({
  className,
}: Readonly<{
  className?: string;
}>) {
  const { sort, sortBy } = useComment();

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1",
              "text-sm text-muted-foreground font-semibold",
              "cursor-pointer"
            )}
          >
            {sortOptions.find((option) => option.value === sort)?.label}
            <Chevron direction="down" className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={12} className="w-72 p-2">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => sortBy(value as SortBy)}
          >
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                disabled={option.value === sort}
                className={cn(
                  "cursor-pointer",
                  "flex flex-col items-start justify-center",
                  "data-[disabled]:opacity-100"
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
