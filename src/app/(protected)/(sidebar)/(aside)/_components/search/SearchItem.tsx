import type {
  FeedItemDto,
  QuerySearchItem,
  SearchItem,
  UserSearchItem,
} from "api";
import type { Actions } from "@/components/providers/PostStorage";

import { SearchItemType } from "@/constants/server";
import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { FeedCard, MediaCell } from "@/components/post";
import { MagnifyingGlass } from "@/components/icons";

type SearchItemProps = Readonly<{
  data: SearchItem;
  actions?: Actions;
  onClick?: () => void;
  className?: string;
}>;

export default function SearchItem({
  data,
  actions,
  onClick,
  className,
}: SearchItemProps) {
  const variant = data.type;

  if (variant === SearchItemType.POST)
    return actions ? (
      <FeedCard
        data={data as FeedItemDto}
        actions={actions}
        onClick={onClick}
        className={cn("w-full", className)}
      />
    ) : null;

  if (variant === SearchItemType.MEDIA)
    return (
      <MediaCell
        data={data as FeedItemDto}
        onClick={onClick}
        className={cn("w-full", className)}
      />
    );

  const Variant = {
    [SearchItemType.USER]: () => (
      <>
        <Avatar
          src={(data as UserSearchItem).avatar}
          alt={(data as UserSearchItem).username}
          size="12"
        />
        <div className="flex flex-col items-start">
          <div className={cn("text-sm font-semibold", "truncate")}>
            {(data as UserSearchItem).displayName ??
              (data as UserSearchItem).username}
          </div>
          <span className={cn("text-sm text-muted-foreground", "truncate")}>
            @{(data as UserSearchItem).username}
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
          {(data as QuerySearchItem).query}
        </span>
      </>
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
        "bg-accent/5"
      )}
    >
      {children}
    </div>
  );
}
