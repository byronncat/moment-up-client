import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/clientConfig";

export default function NotFound() {
  return (
    <div className={cn("w-screen h-svh", "flex justify-center items-center")}>
      <div className={cn("flex flex-col items-center", "px-12 text-center")}>
        <div
          className={cn("text-center", "w-full")}
          style={{
            background:
              "radial-gradient(50% 109137.91% at 50% 50%, rgba(176, 0, 32, 0.2) 0%, rgba(254, 244, 247, 0) 100%)",
          }}
        >
          <div
            className={cn(
              "inline-block px-4 py-1",
              "font-bold text-3xl",
              "bg-red-500 dark:bg-red-400"
            )}
          >
            <span className="text-white">400</span>
          </div>
        </div>
        <h1 className={cn("mt-12 mb-10", "font-bold text-5xl")}>
          Page not found
        </h1>
        <p className={cn("text-muted-foreground", "mb-10")}>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link href={ROUTE.HOME}>
          <Button className="px-12 py-3" variant="outline">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
