import type { z } from "zod";
import type {
  API,
  // HashtagSearchItem,
  SearchItem,
  SearchResult,
  // UserSearchItem,
} from "api";

import zodSchema from "@/libraries/zodSchema";
import { SearchCategory } from "@/constants/clientConfig";

export async function search(
  data: z.infer<typeof zodSchema.core.search>
): API<SearchItem[]> {
  // console.log("search", data);
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 2000);
  // });

  // if (apiRes.search === "Search successful") {
  //   const filteredData = mockSearches.filter((item) => {
  //     if (item.type === "user")
  //       return item.username.toLowerCase().includes(data.query.toLowerCase());
  //     if (item.type === "hashtag")
  //       return item.id.toLowerCase().includes(data.query.toLowerCase());
  //     return item.query.toLowerCase().includes(data.query.toLowerCase());
  //   });

  //   return {
  //     success: true,
  //     message: "ok",
  //     data: filteredData,
  //   };
  // }

  return {
    success: false,
    message: "Internal error",
  };
}

export async function getSearchHistory(): API<SearchItem[]> {
  // console.log("getSearchHistory");
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 2000);
  // });

  // if (apiRes.getSearchHistory === "Search history loaded") {
  //   return {
  //     success: true,
  //     message: "ok",
  //     data: mockSearches.slice(0, 5),
  //   };
  // }

  return {
    success: false,
    message: "Internal error",
  };
}

export async function detailSearch(
  data: z.infer<typeof zodSchema.core.search>,
  type: SearchCategory
): API<SearchResult> {
  // console.log("detailSearch", data, type);
  // try {
  //   await new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(true);
  //     }, 2000);
  //   });

  //   const result: SearchResult = {
  //     posts: mockMoments.filter((moment) =>
  //       moment.post.text?.toLowerCase().includes(data.query.toLowerCase())
  //     ),
  //     users: mockSearches.filter(
  //       (user) =>
  //         user.type === "user" &&
  //         user.username.toLowerCase().includes(data.query.toLowerCase())
  //     ) as UserSearchItem[],
  //     hashtags: mockSearches.filter(
  //       (hashtag) =>
  //         hashtag.type === "hashtag" &&
  //         hashtag.id.toLowerCase().includes(data.query.toLowerCase())
  //     ) as HashtagSearchItem[],
  //   };

  //   if (type === SearchCategory.PEOPLE) {
  //     delete result.posts;
  //     delete result.hashtags;
  //   }
  //   if (type === SearchCategory.MEDIA) {
  //     delete result.users;
  //     delete result.hashtags;
  //   }
  //   if (type === SearchCategory.POSTS) {
  //     delete result.users;
  //     delete result.hashtags;
  //   }
  //   if (type === SearchCategory.HASHTAG) {
  //     delete result.posts;
  //     delete result.users;
  //   }

  //   return {
  //     success: true,
  //     message: "ok",
  //     data: result,
  //   };
  // } catch (error) {
  //   console.error(error);
  return {
    success: false,
    message: "internal error",
  };
  // }
}
