import { cn } from "@/libraries/utils";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import FeedNotificationList from "./FeedNotificationList";
import { ROUTE } from "@/constants/route";

type RightNavProps = Readonly<{
  className?: string;
}>;

export default function RightNav({ className }: RightNavProps) {
  return (
    <ScrollArea
      className={cn(
        "relative box-content",
        "w-[360px] h-full",
        "bg-card-dark text-card-foreground-dark",
        "border-l border-border-dark",
        "flex flex-col overflow-hidden",
        className
      )}
      thumbClassName="bg-accent-dark/30"
    >
      <Header className="px-4 pt-7" />
      <CreateSection className="px-4 mt-6" />
      <FeedNotificationList className="mt-4 grow" />
    </ScrollArea>
  );
}

function Header({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold">Stories</h2>
    </div>
  );
}

function CreateSection({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={className}>
      <h3 className={cn("mb-2", "font-semibold")}>Your feeds</h3>
      <Link href={ROUTE.FEED_CREATE}>
        <div className={cn("py-2", "flex items-center gap-3")}>
          <div
            className={cn(
              "size-14 shrink-0",
              "bg-accent-dark/[.12] rounded-full",
              "flex items-center justify-center"
            )}
          >
            <span className="text-3xl">+</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold">Create a feed</div>
            <div className="text-sm text-muted-foreground">
              Add media file or text.
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// @deprecated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RightNavSkeleton() {
  const FeedItemSkeleton = () => (
    <div className={cn("flex items-center gap-3", "py-2")}>
      <DarkSkeleton className="size-14 rounded-full" />
      <div className="flex-1">
        <DarkSkeleton className="w-24 h-4 my-1" />
        <DarkSkeleton className="w-20 h-3 mt-1.5" />
      </div>
    </div>
  );

  return (
    <>
      <div className="px-4 mt-6">
        <DarkSkeleton className="h-4 w-22 mt-1 mb-3" />
        <FeedItemSkeleton />
      </div>

      <div className="px-4 mt-4">
        <DarkSkeleton className="h-4 w-20 mt-1 mb-3" />
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <FeedItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

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
