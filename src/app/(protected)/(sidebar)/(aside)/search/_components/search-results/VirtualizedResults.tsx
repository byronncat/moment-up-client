"use client";

import type { SearchItem as TSearchItem, MomentInfo } from "api";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, memo } from "react";
import { useMoment } from "@/components/providers";
import { debounce } from "lodash";
import memoize from "memoize-one";
import { areEqual } from "react-window";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
import { SearchCategory } from "@/constants/clientConfig";
import { SearchItemType } from "@/constants/serverConfig";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { VirtualScrollbar } from "@/components/common";
import { SearchItem } from "../../../_components";
import { ErrorContent } from "@/components/common";
import LoadingIndicator from "../LoadingIndicator";
import Container from "./Container";
import { MomentCell } from "@/components/moment";

// Item heights
const DEFAULT_ITEM_HEIGHT = 68;
const FIRST_HEADER_TOP_PADDING = 12;
const HEADER_HEIGHT = 32;
const SECTION_GAP = 24;
const TOP_SPACING_HEIGHT = 129 + 45;

// Moment heights
const POST_HEADER_HEIGHT = 76;
const POST_FOOTER_HEIGHT = 60;
const POST_SINGLE_TEXT_HEIGHT = 28;
const POST_MULTI_TEXT_HEIGHT = 72;
const POST_BORDER_SIZE = 1;
const POST_ITEM_GAP = 16;
const POST_MAX_WIDTH = 600;

const POSTS_TOP_PADDING_HEIGHT = 16;
const MEDIA_TOP_PADDING_HEIGHT = 4;
const MEDIA_COLUMNS = 3;

const ItemStyles = cn(
  "flex items-center justify-between",
  "group",
  "px-4 py-2",
  "cursor-pointer hover:bg-accent/[.05]"
);

const createItemData = memoize(
  (
    results: TSearchItem[],
    type: SearchCategory,
    sectionsData: SectionData[],
    onItemClick?: (item: TSearchItem) => void,
    baseColumnWidth: number = 0
  ) => ({
    results,
    type,
    sectionsData,
    onItemClick,
    baseColumnWidth,
  })
);

interface SectionData {
  type:
    | "top-spacing"
    | "header"
    | "item"
    | "media-row"
    | "posts-top-padding"
    | "media-top-padding";
  title?: string;
  item?: TSearchItem;
  items?: TSearchItem[];
  originalIndex?: number;
  isFirstHeader?: boolean;
}

type VirtualizedSearchResultsProps = Readonly<{
  results: TSearchItem[] | null;
  type: SearchCategory;
  loading: boolean;
  onError: () => void;
}>;

export default function VirtualizedSearchResults({
  results,
  type,
  loading,
  onError,
}: VirtualizedSearchResultsProps) {
  const [isResizing, setIsResizing] = useState(false);
  const listRef = useRef<VariableSizeList>(null);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});

  function handleCustomScroll(newScrollTop: number) {
    listRef.current?.scrollTo(newScrollTop);
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsResizing(false);
    }, PAGE_RELOAD_TIME);

    const onResize = () => {
      setIsResizing(true);
      handleResize();
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      handleResize.cancel();
    };
  }, []);

  const router = useRouter();
  const { setCurrentIndex, setMoments } = useMoment();
  function handleClick(item: TSearchItem) {
    switch (item.type) {
      case SearchItemType.USER:
        router.push(ROUTE.PROFILE(item.username));
        break;
      case SearchItemType.MEDIA:
        setCurrentIndex(item.id);
        break;
      case SearchItemType.POST:
        setCurrentIndex(item.id);
        break;
      default:
        router.push(ROUTE.SEARCH(item.id, SearchCategory.TOP));
    }
  }

  useEffect(() => {
    if (results) {
      const moments = results
        .map((item) =>
          item.type === SearchItemType.POST ||
          item.type === SearchItemType.MEDIA
            ? item
            : null
        )
        .filter((item) => item !== null);
      setMoments(moments);
    }
  }, [results, setMoments]);

  if (loading)
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );
  if (results === null) return <ErrorContent onRefresh={onError} />;
  if (isResizing) return null;
  return (
    <VirtualList
      results={results}
      type={type}
      onItemClick={handleClick}
      listRef={listRef}
      updateScrollbarRef={updateScrollbarRef}
      handleCustomScroll={handleCustomScroll}
    />
  );
}

interface VirtualListProps {
  results: TSearchItem[];
  type: SearchCategory;
  onItemClick?: (item: TSearchItem) => void;
  listRef: React.RefObject<VariableSizeList | null>;
  updateScrollbarRef: React.RefObject<(scrollTop: number) => void>;
  handleCustomScroll: (newScrollTop: number) => void;
}

function VirtualList({
  results,
  type,
  onItemClick,
  listRef,
  updateScrollbarRef,
  handleCustomScroll,
}: VirtualListProps) {
  const sectionsData = prepareSectionsData(results, type);
  const itemCount = sectionsData.length;

  return (
    <AutoSizer>
      {({ height, width }) => {
        const baseColumnWidth = Math.floor(width / MEDIA_COLUMNS);

        const getItemSize = (index: number) => {
          const section = sectionsData[index];

          if (section.type === "top-spacing") return TOP_SPACING_HEIGHT;
          if (section.type === "header")
            return (
              HEADER_HEIGHT +
              (section.isFirstHeader ? FIRST_HEADER_TOP_PADDING : SECTION_GAP)
            );
          if (section.type === "posts-top-padding")
            return POSTS_TOP_PADDING_HEIGHT;
          if (section.type === "media-top-padding")
            return MEDIA_TOP_PADDING_HEIGHT;
          if (section.type === "media-row") return baseColumnWidth;

          if (!section.item) return 0;
          const item = section.item;

          switch (item.type) {
            case SearchItemType.POST:
              if (isValidMomentInfo(item)) {
                return calculatePostHeight(
                  item as MomentInfo,
                  width > POST_MAX_WIDTH ? POST_MAX_WIDTH : width
                );
              }
              return DEFAULT_ITEM_HEIGHT;
            default:
              return DEFAULT_ITEM_HEIGHT;
          }
        };

        const totalHeight = Array.from({ length: itemCount })
          .map((_, i) => getItemSize(i))
          .reduce((a, b) => a + b, 0);

        const itemData = createItemData(
          results,
          type,
          sectionsData,
          onItemClick,
          baseColumnWidth
        );

        return (
          <>
            <VariableSizeList
              ref={listRef}
              itemCount={itemCount}
              itemSize={getItemSize}
              height={height}
              width={width}
              onScroll={({ scrollOffset }) =>
                updateScrollbarRef.current?.(scrollOffset)
              }
              itemData={itemData}
              itemKey={(index) => {
                const section = sectionsData[index];
                if (section.type === "top-spacing") return `top-spacing`;
                if (section.type === "header") return `header-${section.title}`;
                if (
                  section.type === "posts-top-padding" ||
                  section.type === "media-top-padding"
                )
                  return `top-padding`;
                if (section.type === "media-row") return `media-row-${index}`;
                return section.item?.id || `item-${index}`;
              }}
              className="scrollbar-hide"
            >
              {VirtualItem}
            </VariableSizeList>

            <VirtualScrollbar
              height={height}
              totalHeight={totalHeight}
              onScroll={handleCustomScroll}
              onScrollUpdate={(updateFn) => {
                updateScrollbarRef.current = updateFn;
              }}
              className="[@media(max-width:calc(640px+48px+32px))]:hidden"
            />
          </>
        );
      }}
    </AutoSizer>
  );
}

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

// === Helper functions ===

function isValidMomentInfo(item: TSearchItem): boolean {
  return (
    (item.type === SearchItemType.POST || item.type === SearchItemType.MEDIA) &&
    "post" in item &&
    item.post != null
  );
}

function calculatePostHeight(moment: MomentInfo, width: number): number {
  let height =
    POST_HEADER_HEIGHT +
    POST_FOOTER_HEIGHT +
    POST_ITEM_GAP +
    2 * POST_BORDER_SIZE;

  if (moment.post.files?.length) {
    if (moment.post.files.length === 1) {
      const file = moment.post.files[0];
      switch (file.aspectRatio) {
        case "1:1":
          height += width;
          break;
        case "4:5":
          height += (width * 5) / 4;
          break;
        case "1.91:1":
          height += width / 1.91;
          break;
        case "9:16":
          height += (width * 16) / 9;
          break;
        default:
          height += width;
      }
    } else height += width;

    if (moment.post.text) height += POST_SINGLE_TEXT_HEIGHT;
  } else if (moment.post.text) height += POST_MULTI_TEXT_HEIGHT;

  return height;
}

function prepareSectionsData(
  results: TSearchItem[],
  type: SearchCategory
): SectionData[] {
  const sections: SectionData[] = [];
  sections.push({ type: "top-spacing" });

  switch (type) {
    case SearchCategory.PEOPLE:
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.HASHTAG:
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.POSTS:
      sections.push({ type: "posts-top-padding" });
      results.forEach((item, index) => {
        sections.push({ type: "item", item, originalIndex: index });
      });
      break;

    case SearchCategory.MEDIA:
      sections.push({ type: "media-top-padding" });
      for (let i = 0; i < results.length; i += MEDIA_COLUMNS) {
        const rowItems = results.slice(i, i + MEDIA_COLUMNS);
        sections.push({
          type: "media-row",
          items: rowItems,
          originalIndex: i,
        });
      }
      break;

    default:
      const users = results.filter((item) => item.type === SearchItemType.USER);
      const hashtags = results.filter(
        (item) => item.type === SearchItemType.HASHTAG
      );
      const posts = results.filter((item) => item.type === SearchItemType.POST);

      let isFirstHeader = true;

      if (users.length > 0) {
        sections.push({ type: "header", title: "People", isFirstHeader });
        isFirstHeader = false;
        users.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }

      if (hashtags.length > 0) {
        sections.push({ type: "header", title: "Trending", isFirstHeader });
        isFirstHeader = false;
        hashtags.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }

      if (posts.length > 0) {
        sections.push({ type: "header", title: "Posts", isFirstHeader });
        isFirstHeader = false;
        posts.forEach((item, index) => {
          sections.push({ type: "item", item, originalIndex: index });
        });
      }
      break;
  }

  return sections;
}
