"use client";

// === Type ===
import type { MomentInfo, PaginationInfo, StoryNotificationInfo } from "api";

type HomeFeedContextType = Readonly<{
  moments: MomentInfo[] | undefined;
  hasNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  isNextPageLoading: boolean;
  isStoriesLoading: boolean;
  isStoriesError: boolean;
  reloadPost: () => void;
  loadNextPage: () => Promise<void> | void;
}>;

// === Provider ===
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import useSWRInfinite from "swr/infinite";
import useSWRImmutable from "swr/immutable";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { useMomentStore } from "@/components/providers/MomentStorage";
import { useStory } from "@/components/providers/StoryStorage";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { INITIAL_PAGE } from "@/constants/server";

const HomeFeedContext = createContext<HomeFeedContextType>({
  moments: undefined,
  hasNextPage: false,
  isLoading: false,
  isError: false,
  isNextPageLoading: false,
  isStoriesLoading: false,
  isStoriesError: false,
  reloadPost: () => {},
  loadNextPage: () => {},
});

export const useHomeFeed = () => useContext(HomeFeedContext);

export function HomeFeedProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { token } = useAuth();
  const swrFetcherWithRefresh = useRefreshSWR();

  // === Post data ===
  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<MomentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.post.home(pageIndex + 1);
    return [url, token.accessToken] as const;
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationInfo<MomentInfo>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
      }
    );

  const { moments, setMoments } = useMomentStore();
  const { setStories } = useStory();

  const hasNextPage = useMemo(
    () => (data ? (data[data.length - 1]?.hasNextPage ?? false) : true),
    [data]
  );

  const allMoments = useMemo(() => {
    return data instanceof Array
      ? data.flatMap((page) => page.items)
      : undefined;
  }, [data]);

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    if (!error && allMoments) setMoments(allMoments);
  }, [allMoments, error, setMoments]);

  // === Story data ===
  const {
    data: storiesData,
    isLoading: isStoriesLoading,
    error: storiesError,
  } = useSWRImmutable([ApiUrl.story.get, token.accessToken], ([url, token]) =>
    SWRFetcherWithToken<{ stories: StoryNotificationInfo[] }>(url, token)
  );

  useEffect(() => {
    if (storiesData?.stories) setStories(storiesData.stories);
  }, [storiesData?.stories, setStories]);

  const value: HomeFeedContextType = {
    moments,
    hasNextPage,
    isLoading,
    isError: !!error,
    isNextPageLoading: isValidating,
    reloadPost: mutate,
    loadNextPage,

    isStoriesLoading,
    isStoriesError: !isStoriesLoading && (!!storiesError || !storiesData),
  };

  return (
    <HomeFeedContext.Provider value={value}>
      {children}
    </HomeFeedContext.Provider>
  );
}
