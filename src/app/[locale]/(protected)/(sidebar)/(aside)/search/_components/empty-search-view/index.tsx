import { cn } from "@/libraries/utils";
import SearchHistory from "./SearchHistory";
import PopularAccounts from "./PopularAccounts";

export default function NoSearchState({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn(className)}>
      <SearchHistory className="mb-6" />
      <PopularAccounts />
    </div>
  );
}
