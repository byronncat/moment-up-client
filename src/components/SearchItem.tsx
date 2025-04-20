import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleCheck, User, MagnifyingGlass } from "@/components/icons";

type SearchItemProps = Readonly<{
  data: any;
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
            src={data.avatar}
            alt={data.username}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{data.username}</span>
            {data.verified && <CircleCheck className="size-3.5 fill-primary" />}
          </div>
          <span className="text-sm text-muted-foreground">{data.name}</span>
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
        <span className="text-sm">{data.query}</span>
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
        <span className="text-sm">{data.tag}</span>
      </>
    ),
  };

  return <div className="flex items-center gap-3">{Variant[variant]()}</div>;
}
