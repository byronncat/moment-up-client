"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/libraries/utils";
import Link from "next/link";

export type NavItem = {
  id: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  onSelect?: () => void;
};

type NavigationProps = Readonly<{
  items: NavItem[];
  className?: string;
  initialValue?: NavItem["id"];
}>;

export default function HorizontalNavigationBar({
  items,
  className,
  initialValue,
}: NavigationProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(initialValue ?? items[0]?.id);

  return (
    <div className={cn("w-full", "border-b border-border", className)}>
      <div className="flex">
        {items.map((item) => {
          if (item.href) {
            const activeTab = items.find((item) => pathname === item.href)?.id;
            return (
              <Link href={item.href} key={item.id} className="flex-1">
                <Item data={item} active={activeTab === item.id} />
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                item.onSelect?.();
                setActiveTab(item.id);
              }}
              className="flex-1 cursor-pointer"
            >
              <Item data={item} active={activeTab === item.id} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ItemProps = Readonly<{
  data: NavItem;
  active?: boolean;
}>;

function Item({ data, active }: ItemProps) {
  return (
    <div
      key={data.id}
      className={cn(
        "relative size-full",
        "py-3",
        "transition-colors duration-200 ease-in-out",
        active
          ? "text-primary bg-primary/20"
          : "text-muted-foreground hover:bg-muted-foreground/10"
      )}
    >
      <div className={cn("flex justify-center items-center gap-2", "w-full")}>
        {data.icon}
        <span
          className={cn("text-sm", active ? "font-semibold" : "font-medium")}
        >
          {data.label}
        </span>
      </div>
      {active ? (
        <span
          className={cn("absolute bottom-0 left-0", "w-full h-0.5 bg-primary")}
        />
      ) : null}
    </div>
  );
}
