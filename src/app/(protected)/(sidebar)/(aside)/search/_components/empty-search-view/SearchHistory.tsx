"use client";

import type { SearchItem as TSearchItem } from "@/utilities/search-history";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTE } from "@/constants/route";
import { SearchHistory as SearchHistoryUtil } from "@/utilities";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { SearchItem } from "../../../_components";
import { X } from "@/components/icons";
import { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";

const HISTORY_LIMIT = 7;

export default function SearchHistory({
  className,
}: Readonly<{ className?: string }>) {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<TSearchItem[]>(() =>
    SearchHistoryUtil.get(HISTORY_LIMIT)
  );

  function handleClick(item: TSearchItem) {
    switch (item.type) {
      case SearchItemType.USER:
        router.push(ROUTE.PROFILE(item.username));
        break;
      case SearchItemType.QUERY:
        router.push(ROUTE.SEARCH(item.query, SearchCategory.PEOPLE));
        break;
    }
  }

  function handleRemove(item: TSearchItem) {
    const id = item.type === SearchItemType.USER ? item.id : item.query;
    setHistoryItems(SearchHistoryUtil.remove(id));
  }

  function handleClear() {
    SearchHistoryUtil.clear();
    setHistoryItems([]);
  }

  if (historyItems.length === 0) return null;
  return (
    <div className={className}>
      <Header onClear={handleClear} />
      <div>
        {historyItems.map((item) => (
          <div
            key={item.type === SearchItemType.USER ? item.id : item.query}
            onClick={() => handleClick(item)}
            className={cn(
              "flex items-center justify-between",
              "group",
              "px-4 py-3",
              "cursor-pointer hover:bg-accent/[.05]"
            )}
          >
            <SearchItem data={item} />
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-full"
              onClick={(event) => {
                event.stopPropagation();
                handleRemove(item);
              }}
            >
              <X className="size-4 fill-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ onClear }: Readonly<{ onClear: () => void }>) {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 pl-4")}>
      <h2 className="font-semibold">Recent</h2>
      <button
        onClick={onClear}
        className={cn(
          "text-primary",
          "hover:bg-primary/10 px-1.5 py-0.5 mr-2.5 rounded-lg",
          "transition-colors duration-200 ease-in-out",
          "text-sm cursor-pointer"
        )}
      >
        Clear all
      </button>
    </div>
  );
}

// import { cn } from "@/libraries/utils";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// type ClearButtonProps = {
//   onClear: () => void;
// };

// export default function ClearButton({ onClear }: ClearButtonProps) {
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <button
//           className={cn(
//             "text-xs font-semibold text-primary",
//             "cursor-pointer hover:bg-primary/10 px-1.5 py-1 rounded-lg",
//             "transition-colors duration-150 ease-in-out"
//           )}
//         >
//           Clear all
//         </button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Clear search history</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to clear all your recent searches? This action
//             cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={onClear}>Clear</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
