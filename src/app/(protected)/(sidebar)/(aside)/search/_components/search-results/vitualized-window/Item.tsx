import type { FeedItemDto, SearchItem as TSearchItem } from "api";
import type { SectionData } from "./constant.ts";
import type { RowComponentProps } from "react-window";

import { memo } from "react";
import { isValidFeedItemDto } from "./helper";

import { cn } from "@/libraries/utils";
import { MediaCell } from "@/components/post/index.js";
import { SearchItem } from "../../../../_components";
import LoadingIndicator from "../../LoadingIndicator";

import type { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";
import { MEDIA_COLUMNS } from "./constant";

const ItemStyles = cn(
  "flex items-center justify-between",
  "group",
  "px-4 py-2",
  "cursor-pointer hover:bg-accent/[.05]"
);

type ItemRowProps = RowComponentProps<{
  results: TSearchItem[];
  type: SearchCategory;
  sectionsData: SectionData[];
  onItemClick: (item: TSearchItem) => void;
  baseColumnWidth: number;
}>;

const Item = memo(
  ({
    index,
    style,
    sectionsData,
    onItemClick,
    baseColumnWidth,
  }: ItemRowProps) => {
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
      return (
        <div style={style} className="flex justify-around gap-1 px-1">
          {Array.from({ length: MEDIA_COLUMNS }).map((_, columnIndex) => {
            const item = section.items?.[columnIndex];

            const cellStyle = {
              width: baseColumnWidth,
            };

            return (
              <div key={columnIndex} style={cellStyle}>
                {item && isValidFeedItemDto(item) ? (
                  <MediaCell
                    data={item as FeedItemDto}
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

    const { item } = section;

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
  }
);

Item.displayName = "SearchItem";

export default Item;
