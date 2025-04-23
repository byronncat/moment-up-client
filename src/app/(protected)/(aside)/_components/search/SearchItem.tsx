import type {
  SearchItem,
  UserSearchItem,
  QuerySearchItem,
  HashtagSearchItem,
} from "api";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleCheck, User, MagnifyingGlass } from "@/components/icons";

type SearchItemProps = Readonly<{
  data: SearchItem;
}>;

export default function SearchItem({ data }: SearchItemProps) {
  const variant = data.type;
  const Variant = {
    user: () => (
      <>
        <Avatar className="size-12">
          <AvatarImage
            src={(data as UserSearchItem).avatar}
            alt={(data as UserSearchItem).username}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
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
            {(data as HashtagSearchItem).tag}
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
