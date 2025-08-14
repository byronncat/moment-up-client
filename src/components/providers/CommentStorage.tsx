"use client";

import type { CommentInfo, PaginationInfo } from "api";

import { createContext, useContext, useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { ApiUrl, CoreApi } from "@/services";
import { toast } from "sonner";
import { SortBy } from "@/constants/clientConfig";
import { INITIAL_PAGE } from "@/constants/serverConfig";

import { ErrorContent, NoContent } from "@/components/common";
import CommentSkeletons from "../moment/comment/Skeletons";
import { Message } from "@/components/icons";

type CommentContextType = {
  comments: CommentInfo[] | undefined;
  loading: boolean;
  sort: SortBy;
  hasNextPage: boolean;
  setComments: (comments: CommentInfo[]) => void;
  addComment: (text: string) => Promise<boolean>;
  sortBy: (value: SortBy) => void;
  isExpanded: (commentId: CommentInfo["id"]) => boolean;
  toggleExpansion: (commentId: CommentInfo["id"]) => void;
  loadNextPage: () => void;
};

const CommentContext = createContext<CommentContextType>({} as any);

export const useComment = () => useContext(CommentContext);
const COMMENTS_PER_PAGE = 12;

type CommentStorageProviderProps = Readonly<{
  momentId: string;
  children: React.ReactNode;
}>;

export default function CommentStorageProvider({
  momentId,
  children,
}: CommentStorageProviderProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<CommentInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.comment.get(momentId, pageIndex + 1, COMMENTS_PER_PAGE);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationInfo<CommentInfo>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
        errorRetryCount: 0,
        revalidateOnFocus: false,
      }
    );

  const [comments, setComments] = useState<CommentInfo[] | undefined>(
    undefined
  );
  const [expandedComments, setExpandedComments] = useState<
    Set<CommentInfo["id"]>
  >(new Set());
  const [sort, setSort] = useState<SortBy>(SortBy.MOST_LIKED);

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;

  useEffect(() => {
    const comments = data
      ? data.flatMap((page) => page?.items || [])
      : undefined;
    if (comments) setComments(comments);
  }, [data]);

  async function loadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  async function addComment(text: string) {
    const { success, message, data } = await CoreApi.addComment(
      momentId,
      text,
      token
    );
    if (success && data) setComments((prev) => [data, ...(prev || [])]);
    else toast.error(message || "Failed to comment! Please try again later.");
    return success;
  }

  function sortBy(value: SortBy) {
    if (!comments) return;
    const orderedComments = comments.sort((a, b) => {
      if (value === SortBy.MOST_LIKED && a.likes !== b.likes)
        return b.likes - a.likes;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    setSort(value);
    setComments(orderedComments);
  }

  function isExpanded(commentId: CommentInfo["id"]) {
    return expandedComments.has(commentId);
  }

  function toggleExpansion(commentId: CommentInfo["id"]) {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) newExpanded.delete(commentId);
    else newExpanded.add(commentId);
    setExpandedComments(newExpanded);
  }

  function refetch() {
    setSize(INITIAL_PAGE);
  }

  let content: React.ReactNode = <CommentSkeletons className="pb-12" />;
  if (!isLoading) {
    if (error)
      content = (
        <InformationWrapper>
          <ErrorContent
            title="Failed to load comments"
            description="Please try again later."
            onRefresh={refetch}
          />
        </InformationWrapper>
      );
    else if (!comments) content = null;
    else if (comments.length === 0)
      content = (
        <>
          {children}
          <InformationWrapper>
            <NoContent
              icon={
                <Message
                  variant="square"
                  text
                  className="size-12 text-muted-foreground"
                />
              }
              title="No comments"
              description="Be the first to comment on this moment."
            />
          </InformationWrapper>
        </>
      );
    else content = <>{children}</>;
  }

  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
        addComment,
        sort,
        sortBy,
        loading: isValidating,
        isExpanded,
        toggleExpansion,
        loadNextPage,
        hasNextPage,
      }}
    >
      {content}
    </CommentContext.Provider>
  );
}

function InformationWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="pt-12 px-6 pb-12">{children}</div>;
}
