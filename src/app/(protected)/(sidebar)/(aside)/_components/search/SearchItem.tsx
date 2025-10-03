import type {
  FeedItemDto,
  HashtagSearchItem,
  SearchItem,
  UserSearchItem,
} from "api";

import { Format } from "@/utilities";
import { SearchItemType } from "@/constants/server";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { FeedCard, MediaCell } from "@/components/post";
import { MagnifyingGlass } from "@/components/icons";

type SearchItemProps = Readonly<{
  data: SearchItem;
  className?: string;
  onClick?: () => void;
}>;

export default function SearchItem({
  data,
  className,
  onClick,
}: SearchItemProps) {
  const variant = data.type;
  const Variant = {
    [SearchItemType.USER]: () => (
      <>
        <Avatar
          src={(data as UserSearchItem).avatar}
          alt={(data as UserSearchItem).username}
          size="12"
        />
        <div className="flex flex-col items-start">
          <div
            className={cn("text-sm font-semibold", "max-w-[180px] truncate")}
          >
            {(data as UserSearchItem).username}
          </div>
          <span
            className={cn(
              "text-sm text-muted-foreground",
              "max-w-[180px] truncate"
            )}
          >
            @{(data as UserSearchItem).displayName}
          </span>
        </div>
      </>
    ),
    [SearchItemType.QUERY]: () => (
      <>
        <IconContainer>
          <MagnifyingGlass className="size-5 fill-muted-foreground" />
        </IconContainer>
        <span className={cn("text-sm", "max-w-[180px] truncate")}>
          {data.id}
        </span>
      </>
    ),
    [SearchItemType.HASHTAG]: () => (
      <>
        <IconContainer>
          <span className="text-xl">#</span>
        </IconContainer>
        <div className="flex flex-col items-start">
          <span
            className={cn("text-sm font-semibold", "max-w-[180px] truncate")}
          >
            {data.id}
          </span>
          <span
            className={cn(
              "text-sm text-muted-foreground",
              "max-w-[180px] truncate"
            )}
          >
            {`${Format.number((data as HashtagSearchItem).count)} tagged`}
          </span>
        </div>
      </>
    ),
    [SearchItemType.POST]: () => (
      <FeedCard
        key={data.id}
        data={data as FeedItemDto}
        actions={{} as any}
        onClick={onClick}
        className="size-full"
      />
    ),
    [SearchItemType.MEDIA]: () => (
      <MediaCell
        key={data.id}
        data={data as FeedItemDto}
        onClick={onClick}
        className="size-full"
      />
    ),
  };

  return (
    <div className={cn("flex items-center gap-3", className)} onClick={onClick}>
      {Variant[variant]()}
    </div>
  );
}

function IconContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "size-12 rounded-full",
        "flex items-center justify-center",
        "bg-accent/[.05]"
      )}
    >
      {children}
    </div>
  );
}
