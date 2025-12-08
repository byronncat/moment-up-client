import { cn } from "@/libraries/utils";
import Link from "next/link";
import { MagnifyingGlass, User } from "@/components/icons";
import { ROUTE } from "@/constants/route";
import { SearchCategory } from "@/constants/client";

const USERNAME_REGEX = /^@?(?!\.)(?!.*\.\.)([a-zA-Z0-9._]+)(?<!\.)$/;

export default function EmptyState({ query }: Readonly<{ query: string }>) {
  if (!query)
    return (
      <div
        className={cn(
          "px-4 pt-3 pb-6",
          "text-sm text-muted-foreground",
          "text-center flex flex-col items-center"
        )}
      >
        <span>Try searching for people, places,</span>
        <span>things, or hashtags</span>
      </div>
    );

  const isValidUsername = USERNAME_REGEX.test(query);
  const username = query.startsWith("@") ? query.slice(1) : query;
  return (
    <div>
      <Link
        href={ROUTE.SEARCH(query, SearchCategory.POSTS)}
        className={cn(
          "pl-5 py-3 block",
          "cursor-pointer hover:bg-accent/5",
          "outline-none focus:bg-accent/5",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        <div
          className={cn(
            "text-sm text-muted-foreground fill-muted-foreground",
            "flex items-center gap-3"
          )}
        >
          <MagnifyingGlass className="size-4" />
          Search for {query}
        </div>
      </Link>
      <Link
        href={ROUTE.SEARCH(username, SearchCategory.PEOPLE)}
        className={cn(
          "pl-5 py-3 block",
          "cursor-pointer hover:bg-accent/5",
          "outline-none focus:bg-accent/5",
          "transition-colors duration-150 ease-in-out",
          !isValidUsername && "opacity-0 cursor-default pointer-events-none"
        )}
      >
        <div
          className={cn(
            "text-sm text-muted-foreground fill-muted-foreground",
            "flex items-center gap-3"
          )}
        >
          <User className="size-4" type="solid" /> Find user @{username}
        </div>
      </Link>
    </div>
  );
}
