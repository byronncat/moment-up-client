"use client";

import { useEffect, useState } from "react";
import { cn } from "@/libraries/utils";
import { Input } from "@/components/ui/input";
import { Loader, MagnifyingGlass, X } from "@/components/icons";

interface SearchInput extends React.ComponentProps<"input"> {
  loading?: boolean;
}

export default function SearchInput({
  defaultValue = "",
  loading = false,
  ...props
}: SearchInput) {
  const [query, setQuery] = useState(defaultValue);

  function changeQuery(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    props.onChange?.(event);
  }

  function clearQuery() {
    setQuery("");
    props.onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  }

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <div className="relative">
      {loading ? (
        <Loader
          className={cn(
            "size-4 animate-spin",
            "absolute left-3 top-1/2 -translate-y-1/2 z-10",
            "text-muted-foreground"
          )}
        />
      ) : (
        <MagnifyingGlass
          className={cn(
            "size-4",
            "absolute left-3 top-1/2 -translate-y-1/2 z-10",
            "fill-muted-foreground"
          )}
        />
      )}
      <Input
        type="text"
        placeholder="Search"
        className="h-10 px-9 w-full"
        {...props}
        value={query}
        onChange={changeQuery}
        autoComplete="off"
      />
      {query ? <ClearButton onClear={clearQuery} /> : null}
    </div>
  );
}

function ClearButton({ onClear }: Readonly<{ onClear: () => void }>) {
  return (
    <button
      onClick={onClear}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 z-10",
        "p-1 rounded-full",
        "cursor-pointer",
        "hover:bg-accent/7 focus-indicator",
        "transition-colors duration-150 ease-in-out"
      )}
    >
      <X className="size-3.5 text-muted-foreground" />
    </button>
  );
}
