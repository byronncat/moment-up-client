import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, XMark } from "@/components/icons";
import React from "react";

type SearchInputProps = Readonly<{
  query: string;
  setQuery: (value: string) => void;
}> &
  React.ComponentProps<"input">;

export default function SearchInput({
  query,
  setQuery,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <MagnifyingGlass
        className={cn(
          "size-4",
          "absolute left-3 top-1/2 -translate-y-1/2 z-10",
          "fill-muted-foreground"
        )}
      />
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn("h-10 bg-card pl-9", query && "pr-9")}
        {...props}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 z-10",
            "p-1 rounded-full",
            "cursor-pointer",
            "hover:bg-accent",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <XMark className="size-3 fill-muted-foreground" />
        </button>
      )}
    </div>
  );
}
