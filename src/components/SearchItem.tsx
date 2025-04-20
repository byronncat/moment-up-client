import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleCheck, User, MagnifyingGlass } from "@/components/icons";

type UserData = {
  avatar: string;
  username: string;
  name: string;
  verified?: boolean;
};

type QueryData = {
  query: string;
};

type HashtagData = {
  tag: string;
};

type SearchItemProps = Readonly<{
  data: UserData | QueryData | HashtagData;
  variant?: "query" | "user" | "hashtag";
}>;

export default function SearchItem({
  data,
  variant = "user",
}: SearchItemProps) {
  const Variant = {
    user: () => (
      <>
        <Avatar className="size-12">
          <AvatarImage
            src={(data as UserData).avatar}
            alt={(data as UserData).username}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {(data as UserData).username}
            </span>
            {(data as UserData).verified && (
              <CircleCheck className="size-3.5 fill-primary" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {(data as UserData).name}
          </span>
        </div>
      </>
    ),
    query: () => (
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
        <span className="text-sm">{(data as QueryData).query}</span>
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
        <span className="text-sm">{(data as HashtagData).tag}</span>
      </>
    ),
  };

  return <div className="flex items-center gap-3">{Variant[variant]()}</div>;
}
