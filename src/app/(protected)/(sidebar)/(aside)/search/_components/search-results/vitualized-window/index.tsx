"use client";

import type { SearchItem as TSearchItem } from "api";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePost } from "@/components/providers";
import { debounce } from "lodash";

import { NoContent } from "@/components/common";
import { ErrorContent } from "@/components/common";
import LoadingIndicator from "../../LoadingIndicator";
import Container from "../Container";
import VirtualList from "./List";
import { MagnifyingGlass } from "@/components/icons";

import { PAGE_RELOAD_TIME } from "@/constants/client";
import { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";
import { ROUTE } from "@/constants/route";

type VirtualizedSearchResultsProps = Readonly<{
  results: TSearchItem[] | null;
  type: SearchCategory;
  loading: boolean;
  error: boolean;
  isValidating?: boolean;
  hasNextPage?: boolean;
  loadNextPage?: () => void;
  onError: () => void;
}>;

export default function VirtualizedSearchResults({
  results,
  type,
  loading,
  error,
  isValidating = false,
  hasNextPage = false,
  loadNextPage,
  onError,
}: VirtualizedSearchResultsProps) {
  const [isResizing, setIsResizing] = useState(false);

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
  const { setCurrentPost: setCurrentIndex, setPosts } = usePost();
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
      setPosts(moments);
    }
  }, [results, setPosts]);

  if (loading)
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorContent onRefresh={onError} />
      </Container>
    );
  if (isResizing || results === null) return null;
  if (results.length === 0)
    return (
      <Container>
        <NoContent
          icon={<MagnifyingGlass className="size-10" />}
          title="No results found"
          description="Try a different search term."
        />
      </Container>
    );
  return (
    <VirtualList
      results={results}
      type={type}
      onItemClick={handleClick}
      hasNextPage={hasNextPage}
      isValidating={isValidating}
      loadNextPage={loadNextPage}
    />
  );
}
