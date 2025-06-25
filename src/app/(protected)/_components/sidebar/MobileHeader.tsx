import { cn } from "@/libraries/utils";
import Link from "next/link";
import { ROUTE } from "@/constants/clientConfig";
import { Bell, User } from "@/components/icons";

export default function MobileHeader() {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-20",
        "bg-background border-b border-border",
        "flex items-center justify-between",
        "p-2 px-4 h-14"
      )}
    >
      <Link href={ROUTE.HOME} className="text-primary font-semibold text-lg">
        MomentUp
      </Link>
      <div className="flex items-center">
        <Link
          href="#"
          className={cn(
            "flex items-center justify-center",
            "p-2",
            "hover:bg-accent/[.1] rounded-md",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <Bell className="size-6" />
        </Link>
        <Link
          href="#"
          className={cn(
            "flex items-center justify-center",
            "p-2 ml-2",
            "hover:bg-accent/[.1] rounded-md",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <User className="size-6" />
        </Link>
      </div>
    </div>
  );
}
