"use client";

import { useState, useEffect } from "react";
import { cn } from "@/libraries/utils";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, XMark } from "@/components/icons";

export default function SearchInput({
  defaultValue = "",
  ...props
}: React.ComponentProps<"input">) {
  const [query, setQuery] = useState(defaultValue);

  function changeQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    props.onChange?.(e);
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
        className="h-10 px-9 w-full"
        {...props}
        value={query}
        onChange={changeQuery}
      />
      {query && <ClearButton onClear={clearQuery} />}
    </div>
  );
}

function ClearButton({ onClear }: Readonly<{ onClear: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 z-10",
        "p-1 rounded-full",
        "cursor-pointer",
        "hover:bg-accent/[.07]",
        "transition-colors duration-150 ease-in-out"
      )}
    >
      <XMark className="size-3 fill-muted-foreground" />
    </button>
  );
}
