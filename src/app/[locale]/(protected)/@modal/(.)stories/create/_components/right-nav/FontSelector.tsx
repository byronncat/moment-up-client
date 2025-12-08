import { useState } from "react";
import { useCreateData } from "../../_providers";
import { FontFamilies } from "../../_constants";

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
              "bg-input-dark hover:bg-accent-dark/7",
              "border-accent-dark/20 hover:border-accent-dark/30",
              "focus:ring-1 focus:ring-accent-dark/50",
              "transition-colors duration-100 ease-in-out"
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
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          disablePortal
          className={cn(
            "w-[328px] p-0",
            "border-border-dark",
            "shadow-lg shadow-black/20",
            "bg-input-dark"
          )}
        >
          <Command className="bg-input-dark">
            <CommandList>
              <CommandEmpty className="text-muted-foreground-dark py-6 text-center text-sm">
                No font found.
              </CommandEmpty>
              <CommandGroup className="p-2">
                {FontFamilies.map(({ family, label }) => {
                  const isSelected = font.family === family;

                  return (
                    <CommandItem
                      key={family}
                      value={family}
                      onSelect={(currentValue) => {
                        const selectedFont = FontFamilies.find(
                          ({ family }) => family === currentValue
                        );
                        if (selectedFont) setFont(selectedFont);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3",
                        "p-3 rounded-lg cursor-pointer",
                        "text-white",
                        "transition-colors duration-75 ease-in-out",
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
                          style={{ fontFamily: family }}
                          className="text-xl"
                        >
                          Aa
                        </span>
                        <span>{label}</span>
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
