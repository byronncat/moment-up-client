import type {
  SearchItem,
  UserSearchItem,
  QuerySearchItem,
  HashtagSearchItem,
} from "api";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components";
import { CircleCheck, MagnifyingGlass } from "@/components/icons";

type SearchItemProps = Readonly<{
  data: SearchItem;
}>;

export default function SearchItem({ data }: SearchItemProps) {
  const variant = data.type;
  const Variant = {
    user: () => (
      <>
        <Avatar
          src={(data as UserSearchItem).avatar}
          alt={(data as UserSearchItem).username}
          size="12"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {(data as UserSearchItem).username}
            </span>
            {(data as UserSearchItem).verified && (
              <CircleCheck className="size-3.5 fill-primary" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {(data as UserSearchItem).displayName}
          </span>
        </div>
      </>
    ),
    search: () => (
      <>
        <div
          className={cn(
            "size-12 rounded-full",
            "flex items-center justify-center",
            "bg-accent/[.07]"
          )}
        >
          <MagnifyingGlass className="size-5 fill-muted-foreground" />
        </div>
        <span className="text-sm">{(data as QuerySearchItem).query}</span>
      </>
    ),
    hashtag: () => (
      <>
        <div
          className={cn(
            "size-12 rounded-full",
            "flex items-center justify-center",
            "bg-accent/[.07]"
          )}
        >
          <span className="text-xl">#</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {(data as HashtagSearchItem).id}
          </span>
          <span className="text-sm text-muted-foreground">
            {`${(data as HashtagSearchItem).count} tagged`}
          </span>
        </div>
      </>
    ),
  };

  return <div className="flex items-center gap-3">{Variant[variant]()}</div>;
}
