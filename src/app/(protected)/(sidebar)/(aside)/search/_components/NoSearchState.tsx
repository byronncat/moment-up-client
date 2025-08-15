import type { SearchItem, PopularProfileItem } from "api";

import { useAuth } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";

import { cn } from "@/libraries/utils";
import { ErrorContent } from "@/components/common";
import LoadingIndicator from "./LoadingIndicator";
import SearchHistory from "./SearchHistory";
import PopularAccounts from "./PopularAccounts";

const HISTORY_LIMIT = 5;

export default function NoSearchState() {
  const { token } = useAuth();

  const {
    data: searchHistoryData,
    isLoading: isSearchHistoryLoading,
    error: searchHistoryError,
    mutate: mutateSearchHistory,
  } = useSWRImmutable(
    [ApiUrl.search.getHistory(HISTORY_LIMIT), token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        history: SearchItem[];
      }>(url, token)
  );

  const {
    data: popularAccountsData,
    isLoading: isPopularAccountsLoading,
    error: popularAccountsError,
    mutate: mutatePopularAccounts,
  } = useSWRImmutable(
    [ApiUrl.suggestion.popular, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        users: PopularProfileItem[];
      }>(url, token)
  );

  const searchHistory = searchHistoryData?.history;
  const popularAccounts = popularAccountsData?.users;

  function handleRefresh() {
    mutateSearchHistory({
      history: [],
    });
    mutatePopularAccounts({
      users: [],
    });
  }

  if (isSearchHistoryLoading || isPopularAccountsLoading)
    return <LoadingIndicator />;
  if (searchHistoryError && popularAccountsError)
    return (
      <div className="pt-16 pb-12">
        <ErrorContent onRefresh={handleRefresh} />
      </div>
    );

  return (
    <div className="pb-10">
      {searchHistory && <SearchHistory history={searchHistory} />}
      {popularAccounts && (
        <PopularAccounts
          users={popularAccounts}
          className={cn(searchHistory && "mt-6")}
        />
      )}
    </div>
  );
}
