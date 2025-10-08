"use client";

import { useSearch } from "../../_Search.provider";
import { SearchCategory } from "@/constants/client";
import PostsList from "./PostList";
import MediaGrid from "./PostGrid";
import MixedList from "./MixedResults";

export default function SearchResults() {
  const { activeCategory } = useSearch();

  if (activeCategory === SearchCategory.POSTS) return <PostsList />;
  if (activeCategory === SearchCategory.MEDIA) return <MediaGrid />;
  return <MixedList />;
}
