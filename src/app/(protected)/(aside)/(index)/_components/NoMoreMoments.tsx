"use client";

import { useRouter } from "next/navigation";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NoMoreMoments() {
  const router = useRouter();

  return (
    <div
      className={cn("flex flex-col items-center justify-center", "py-8 mt-2")}
    >
      <p className={cn("text-base font-medium")}>No more moments</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1 text-center")}>
        Follow more users to see more content in your feed
      </p>
      <Button
        variant="outline"
        size="sm"
        className={cn("mt-4")}
        onClick={() => router.push(ROUTE.EXPLORE())}
      >
        <Compass />
        Discover People
      </Button>
    </div>
  );
}
