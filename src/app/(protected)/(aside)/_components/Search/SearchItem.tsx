import type { SearchItem, UserSearchItem, HashtagSearchItem } from "api";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { MagnifyingGlass } from "@/components/icons";
import { SearchItemType } from "@/constants/serverConfig";

type SearchItemProps = Readonly<{
  data: SearchItem;
}>;

export default function SearchItem({ data }: SearchItemProps) {
  const variant = data.type;
  const Variant = {
    [SearchItemType.USER]: () => (
      <>
        <Avatar
          src={(data as UserSearchItem).avatar}
          alt={(data as UserSearchItem).username}
          size="12"
        />
        <div className="flex flex-col">
          <div
            className={cn("flex items-center gap-2", "text-sm font-semibold")}
          >
            {(data as UserSearchItem).username}
          </div>
          <span className="text-sm text-muted-foreground">
            {(data as UserSearchItem).displayName}
          </span>
        </div>
      </>
    ),
    [SearchItemType.QUERY]: () => (
      <>
        <IconContainer>
          <MagnifyingGlass className="size-5 fill-muted-foreground" />
        </IconContainer>
        <span className="text-sm">{data.id}</span>
      </>
    ),
    [SearchItemType.HASHTAG]: () => (
      <>
        <IconContainer>
          <span className="text-xl">#</span>
        </IconContainer>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">{data.id}</span>
          <span className="text-sm text-muted-foreground">
            {`${(data as HashtagSearchItem).count} tagged`}
          </span>
        </div>
      </>
    ),
  };

  return <div className="flex items-center gap-3">{Variant[variant]()}</div>;
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
