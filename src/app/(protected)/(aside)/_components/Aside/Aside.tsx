import { SuggestingApi } from "@/services";

import { cn } from "@/libraries/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SwitchAccount from "./SwitchAccount";
import SuggestedUsers from "./SuggestedUsers";
import Footer from "./Footer";
import TrendingTopics from "./TrendingTopics";
import SearchBar from "../Search/SearchBar";

export default function Aside({ className }: Readonly<{ className?: string }>) {
  const trendingTopicsRes = SuggestingApi.getTrendingTopics();
  const suggestedUsersRes = SuggestingApi.getSuggestedUsers();

  return (
    <aside
      className={cn(
        "h-fit w-[20rem]",
        "space-y-6",
        "hidden lg:block",
        className
      )}
    >
      <SearchBar />
      <SwitchAccount />
      <div
        className={cn(
          "overflow-y-auto max-h-[calc(100vh-10rem)]",
          "space-y-6",
          "scrollbar-hide"
        )}
      >
        <Suspense fallback={<TrendingTopicsSkeleton />}>
          <TrendingTopics initialRes={trendingTopicsRes} />
        </Suspense>
        <Suspense fallback={<SuggestedUsersSkeleton />}>
          <SuggestedUsers initialRes={suggestedUsersRes} />
        </Suspense>
        <Footer />
      </div>
    </aside>
  );
}

function TrendingTopicsSkeleton() {
  return (
    <div>
      <HeaderSkeleton className="mb-5" />
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={cn("flex items-center justify-between", "p-2")}
            key={index}
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="size-4 mr-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestedUsersSkeleton() {
  return (
    <div>
      <HeaderSkeleton className="mb-5" />
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={cn("flex items-center justify-between", "p-2")}
            key={index}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-1 mt-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSkeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex items-center justify-between", "px-2", className)}>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
