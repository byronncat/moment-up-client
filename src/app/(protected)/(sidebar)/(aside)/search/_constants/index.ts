import type { SearchFilterParams } from "@/services";
import { SearchCategory } from "@/constants/client";

export type MapType = {
  [key in SearchCategory]: {
    filter?: SearchFilterParams;
  };
};

export const TypeMap: MapType = {
  [SearchCategory.PEOPLE]: {
    filter: "user",
  },
  [SearchCategory.POSTS]: {
    filter: "post",
  },
  [SearchCategory.MEDIA]: {
    filter: "media",
  },
};
