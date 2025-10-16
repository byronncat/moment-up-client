"use client";

// === Type ===
import type { CommentDto, PaginationDto } from "api";

type CommentContextType = {
  comments: CommentDto[] | undefined;
  loading: boolean;
  sort: SortBy;
  hasNextPage: boolean;

  createComment: (text: string) => Promise<boolean>;
  deleteComment: (commentId: string) => void;
  likeComment: (commentId: string, isLiked: boolean) => Promise<void>;
  sortBy: (value: SortBy) => void;
  isExpanded: (commentId: CommentDto["id"]) => boolean;
  toggleExpansion: (commentId: CommentDto["id"]) => void;
  loadNextPage: () => void;
};

// === Provider ===
import { createContext, useContext, useState } from "react";
import useSWRInfinite from "swr/infinite";
import {
  useAuth,
  usePost,
  useRefreshApi,
  useRefreshSWR,
} from "@/components/providers";
import { ApiUrl, CoreApi } from "@/services";
import { toast } from "sonner";
import { ROUTE } from "@/constants/route";
import { SortBy } from "@/constants/client";
import { SWRInfiniteOptions } from "@/helpers/swr";

import Link from "next/link";
import { ErrorContent, NoContent } from "@/components/common";
import CommentZoneSkeleton from "../post/comment/Skeleton";
import { Circle, Message } from "@/components/icons";
import { Alert, AlertTitle } from "@/components/ui/alert";

const CommentContext = createContext<CommentContextType>({
  comments: undefined,
  loading: false,
  sort: SortBy.MOST_LIKED,
  hasNextPage: false,

  createComment: () => Promise.resolve(false),
  deleteComment: () => {},
  likeComment: () => Promise.resolve(),
  sortBy: () => {},
  isExpanded: () => false,
  toggleExpansion: () => {},
  loadNextPage: () => {},
});

export const useComment = () => useContext(CommentContext);
const COMMENTS_PER_PAGE = 12;

type CommentProviderProps = Readonly<{
  postId: string;
  children: React.ReactNode;
}>;

export default function CommentProvider({
  postId,
  children,
}: CommentProviderProps) {
  const [expandedComments, setExpandedComments] = useState<
    Set<CommentDto["id"]>
  >(new Set());
  const [sort, setSort] = useState<SortBy>(SortBy.MOST_LIKED);

  const swrFetcherWithRefresh = useRefreshSWR();
  const { user, token } = useAuth();
  const { updateCommentCount } = usePost();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<CommentDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    if (!user) return null;
    const url = ApiUrl.comment.get(
      postId,
      pageIndex + 1,
      COMMENTS_PER_PAGE,
      sort
    );
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<CommentDto>>(url, accessToken),
      SWRInfiniteOptions
    );

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;

  const comments = data?.flatMap((page) => page?.items);

  async function loadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  const createCommentApi = useRefreshApi(CoreApi.createComment);
  async function createComment(text: string) {
    const { success, message, data } = await createCommentApi({
      text,
      postId,
    });
    if (success && data) {
      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          const newData = [...currentData];
          if (newData[0]) {
            newData[0] = {
              ...newData[0],
              items: [data, ...newData[0].items],
            };
          }
          return newData;
        },
        { revalidate: false }
      );
      updateCommentCount(postId, "increase");
    } else toast.error(message || "Failed to comment! Please try again later.");
    return success;
  }

  const deleteCommentApi = useRefreshApi(CoreApi.deleteComment);
  function deleteComment(commentId: string) {
    toast.promise(deleteCommentApi(commentId), {
      loading: "Deleting comment...",
      success: ({ success, message }) => {
        if (success) {
          mutate(
            (currentData) => {
              if (!currentData) return currentData;
              return currentData.map((page) => ({
                ...page,
                items: page.items.filter((comment) => comment.id !== commentId),
              }));
            },
            { revalidate: false }
          );
          updateCommentCount(postId, "decrease");
          return message;
        }

        throw message || "Failed to delete comment! Please try again later.";
      },
      error: (error: string) => error,
    });
  }

  const likeCommentApi = useRefreshApi(CoreApi.likeComment);
  async function likeComment(commentId: string, shouldLike: boolean) {
    const { success, message } = await likeCommentApi(commentId, shouldLike);

    if (success) {
      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return currentData.map((page) => ({
            ...page,
            items: page.items.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.isLiked
                      ? comment.likes - 1
                      : comment.likes + 1,
                    isLiked: !comment.isLiked,
                  }
                : comment
            ),
          }));
        },
        { revalidate: false }
      );
    } else
      toast.error(message || "Failed to like comment! Please try again later.");
  }

  function isExpanded(commentId: CommentDto["id"]) {
    return expandedComments.has(commentId);
  }

  function toggleExpansion(commentId: CommentDto["id"]) {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) newExpanded.delete(commentId);
    else newExpanded.add(commentId);
    setExpandedComments(newExpanded);
  }

  if (!user)
    return (
      <Link href={ROUTE.LOGIN} className="block p-3">
        <Alert>
          <Circle
            variant="info"
            type="solid"
            className="size-4 fill-muted-foreground"
          />
          <AlertTitle className="font-semibold">
            Login to view comments
          </AlertTitle>
        </Alert>
      </Link>
    );

  let content: React.ReactNode = <CommentZoneSkeleton className="pb-12" />;
  if (!isLoading) {
    if (error)
      content = (
        <ErrorContent
          title="Failed to load comments"
          description="Please try again later."
          onRefresh={mutate}
          className="pt-12 pb-16"
        />
      );
    else if (!comments) content = null;
    else if (comments.length === 0)
      content = (
        <>
          {children}
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
            className="pt-12 pb-16"
          />
        </>
      );
    else content = children;
  }

  return (
    <CommentContext.Provider
      value={{
        comments,
        sort,
        loading: isValidating,
        hasNextPage,

        createComment,
        deleteComment,
        likeComment,
        sortBy: (value) => setSort(value),
        isExpanded,
        toggleExpansion,
        loadNextPage,
      }}
    >
      {content}
    </CommentContext.Provider>
  );
}
