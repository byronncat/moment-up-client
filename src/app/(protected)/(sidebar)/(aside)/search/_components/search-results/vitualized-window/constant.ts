import type { SearchItem } from "api";

export interface SectionData {
  type:
    | "top-spacing"
    | "header"
    | "item"
    | "media-row"
    | "posts-top-padding"
    | "media-top-padding"
    | "loading-indicator";
  title?: string;
  item?: SearchItem;
  items?: SearchItem[];
  originalIndex?: number;
  isFirstHeader?: boolean;
}

export const DEFAULT_ITEM_HEIGHT = 68;
export const FIRST_HEADER_TOP_PADDING = 12;
export const HEADER_HEIGHT = 32;
export const SECTION_GAP = 24;
export const TOP_SPACING_HEIGHT = 129 + 45;
export const LOADING_INDICATOR_HEIGHT = 120;
export const BORDER_SIZE = 1;

// Moment
export const POST_HEADER_HEIGHT = 76;
export const POST_FOOTER_HEIGHT = 60;
export const POST_SINGLE_TEXT_HEIGHT = 28;
export const POST_MULTI_TEXT_HEIGHT = 72;
export const POST_BORDER_SIZE = 1;
export const POST_ITEM_GAP = 16;
export const POST_MAX_WIDTH = 600;

export const POSTS_TOP_PADDING_HEIGHT = 16;
export const MEDIA_TOP_PADDING_HEIGHT = 4;
export const MEDIA_COLUMNS = 3;
