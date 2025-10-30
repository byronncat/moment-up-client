import { usePathname } from "next/navigation";
import { useStory } from "@/components/providers";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import StoryNotificationList, { StoryItem } from "./StoryNotificationList";

type RightNavProps = Readonly<{
  className?: string;
}>;

export default function RightNav({ className }: RightNavProps) {
  return (
    <ScrollArea
      className={cn(
        "relative",
        "w-[360px] h-full",
        "bg-card-dark text-card-foreground-dark",
        "border-l border-border-dark",
        "flex flex-col",
        className
      )}
      thumbClassName="bg-accent-dark/30"
    >
      <div className="px-4 pt-7">
        <h2 className="text-2xl font-bold">Stories</h2>
      </div>

      <CreateSection className="mt-6" />
      <StoryNotificationList className="mt-4 grow" />
    </ScrollArea>
  );
}

function CreateSection({ className }: Readonly<{ className?: string }>) {
  const { myStory } = useStory();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  return (
    <div className={className}>
      <h3 className={cn("mb-2 px-4", "font-semibold")}>Your stories</h3>

      <div>
        <Link href={ROUTE.STORY_CREATE}>
          <div className={cn("px-4 py-2", "flex items-center gap-3")}>
            <div
              className={cn(
                "size-14 shrink-0",
                "bg-accent-dark/12 rounded-full",
                "flex items-center justify-center"
              )}
            >
              <span className="text-3xl">+</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold">Create a story</div>
              <div className="text-sm text-muted-foreground-dark">
                Add media file or text.
              </div>
            </div>
          </div>
        </Link>

        {myStory ? (
          <StoryItem data={myStory} isCurrent={myStory.username === username} />
        ) : null}
      </div>
    </div>
  );
}

// @deprecated
function _RightNavSkeleton() {
  return (
    <>
      <div className="px-4 mt-6">
        <DarkSkeleton className="h-4 w-22 mt-1 mb-3" />
        <StoryItemSkeleton />
      </div>

      <div className="px-4 mt-4">
        <DarkSkeleton className="h-4 w-20 mt-1 mb-3" />
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StoryItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

const StoryItemSkeleton = () => (
  <div className={cn("flex items-center gap-3", "py-2")}>
    <DarkSkeleton className="size-14 rounded-full" />
    <div className="flex-1">
      <DarkSkeleton className="w-24 h-4 my-1" />
      <DarkSkeleton className="w-20 h-3 mt-1.5" />
    </div>
  </div>
);

function DarkSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-foreground-dark/10",
        className
      )}
      {...props}
    />
  );
}
