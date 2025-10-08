import { SearchCategory } from "@/constants/client";
import { SearchFilterParams, SearchSortParams } from "@/services";

export type MapType = {
  [key in SearchCategory]: {
    filter?: SearchFilterParams;
    order: SearchSortParams;
  };
};

export const TypeMap: MapType = {
  // [SearchCategory.TOP]: {
  //   order: "most_popular",
  // },
  // [SearchCategory.LATEST]: {
  //   order: "newest",
  // },
  [SearchCategory.PEOPLE]: {
    filter: "user",
    order: "most_popular",
  },
  [SearchCategory.POSTS]: {
    filter: "post",
    order: "most_popular",
  },
  [SearchCategory.MEDIA]: {
    filter: "media",
    order: "most_popular",
  },
};
