import type { SearchItem as TSearchItem, MomentInfo } from "api";
import type { SectionData } from "./constant.ts";

import { memo } from "react";
import { areEqual } from "react-window";
import { isValidMomentInfo } from "./helper";

import { cn } from "@/libraries/utils";
import { MomentCell } from "@/components/moment";
import { SearchItem } from "../../../../_components";
import LoadingIndicator from "../../LoadingIndicator";

import { SearchCategory } from "@/constants/clientConfig";
import { SearchItemType } from "@/constants/serverConfig";
import { MEDIA_COLUMNS } from "./constant";

const ItemStyles = cn(
  "flex items-center justify-between",
  "group",
  "px-4 py-2",
  "cursor-pointer hover:bg-accent/[.05]"
);

type VirtualItemProps = Readonly<{
  index: number;
  data: {
    results: TSearchItem[];
    type: SearchCategory;
    sectionsData: SectionData[];
    onItemClick?: (item: TSearchItem) => void;
    baseColumnWidth: number;
  };
  style: React.CSSProperties;
}>;

const VirtualItem = memo(({ index, data, style }: VirtualItemProps) => {
  const { sectionsData, onItemClick } = data;
  const section = sectionsData[index];

  if (section.type === "top-spacing") return null;

  if (section.type === "header") {
    return (
      <div
        style={style}
        className={cn("flex justify-between items-center", "px-4")}
      >
        <div
          className={cn(
            "flex flex-col justify-end h-full",
            section.title === "Posts" ? "pb-3" : "pb-2"
          )}
        >
          <h2 className="font-semibold">{section.title}</h2>
        </div>
      </div>
    );
  }

  if (
    section.type === "posts-top-padding" ||
    section.type === "media-top-padding"
  )
    return <div style={style} />;

  if (section.type === "loading-indicator")
    return (
      <div style={style} className="flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );

  if (section.type === "media-row") {
    const { baseColumnWidth } = data;

    return (
      <div style={style} className="flex justify-around gap-1 px-1">
        {Array.from({ length: MEDIA_COLUMNS }).map((_, columnIndex) => {
          const item = section.items?.[columnIndex];

          const cellStyle = {
            width: baseColumnWidth,
          };

          return (
            <div key={columnIndex} style={cellStyle}>
              {item && isValidMomentInfo(item) ? (
                <MomentCell
                  data={item as MomentInfo}
                  onClick={() => onItemClick?.(item)}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  if (!section.item) return null;

  const item = section.item;

  if (item.type === SearchItemType.POST) {
    return (
      <div style={style} className="flex justify-center">
        <SearchItem
          data={item}
          className={cn("size-full", "max-w-[600px] mx-auto h-fit")}
          onClick={() => onItemClick?.(item)}
        />
      </div>
    );
  }

  return (
    <div
      style={style}
      className={ItemStyles}
      onClick={() => onItemClick?.(item)}
    >
      <SearchItem data={item} />
    </div>
  );
}, areEqual);

VirtualItem.displayName = "VirtualSearchItem";

export default VirtualItem;
