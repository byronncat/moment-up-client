import { useState } from "react";
import { useCreateData } from "../../_providers";
import { Font } from "../../_constants";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

export default function FontSelector({
  className,
}: Readonly<{ className?: string }>) {
  const { font, setFont } = useCreateData();
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              "text-white/90 hover:text-white",
              "bg-transparent hover:bg-accent-dark/7",
              "border-accent-dark/20 hover:border-accent-dark/30",
              "focus:ring-1 focus:ring-accent-dark/50",
              "transition-colors duration-100"
            )}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="w-7 text-lg text-muted-foreground-dark"
                style={{ fontFamily: font.family }}
              >
                Aa
              </span>
              <span>{font.label}</span>
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[320px] p-0",
            "bg-card-dark border-border-dark",
            "shadow-lg shadow-black/20"
          )}
        >
          <Command className="bg-card-dark">
            <CommandList className="bg-card-dark">
              <CommandEmpty className="text-muted-foreground-dark py-6 text-center text-sm">
                No font found.
              </CommandEmpty>
              <CommandGroup className="p-2">
                {Font.map((font) => {
                  const isSelected = font.family === font.family;

                  return (
                    <CommandItem
                      key={font.family}
                      value={font.family}
                      onSelect={(currentValue) => {
                        const selectedFont = Font.find(
                          (f) => f.family === currentValue
                        );
                        if (selectedFont) setFont(selectedFont);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3",
                        "p-3 rounded-lg cursor-pointer",
                        "text-white",
                        "transition-colors duration-75",
                        "data-[selected=true]:text-white data-[selected=true]:bg-accent-dark/7"
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "size-4 shrink-0 text-white",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-baseline gap-3 flex-1">
                        <span
                          style={{ fontFamily: font.family }}
                          className="text-xl"
                        >
                          Aa
                        </span>
                        <span>{font.label}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
