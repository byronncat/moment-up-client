"use client";

import type { CommentInfo } from "api";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { CoreApi } from "@/services";
import { toast } from "sonner";
import { SortBy } from "@/constants/clientConfig";

import CommentSkeletons from "../CommentSkeletons";
import { ErrorContent, NoContent } from "@/components";
import { MessageSquareText } from "lucide-react";

const CommentDataContext = createContext(
  {} as {
    comments: CommentInfo[];
    setComments: (comments: CommentInfo[]) => void;
    handleComment: (comment: CommentInfo) => Promise<boolean>;
    loading: boolean;
    sort: SortBy;
    sortBy: (value: SortBy) => void;
    isExpanded: (commentId: CommentInfo["id"]) => boolean;
    toggleExpansion: (commentId: CommentInfo["id"]) => void;
    fetchMore: () => void;
    hasNextPage: boolean;
  }
);

export const useComment = () => useContext(CommentDataContext);

type CommentDataProviderProps = Readonly<{
  momentId: string;
  children: React.ReactNode;
}>;

export default function CommentDataProvider({
  momentId,
  children,
}: CommentDataProviderProps) {
  const page = useRef(1);
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [expandedComments, setExpandedComments] = useState<
    Set<CommentInfo["id"]>
  >(new Set());
  const [sort, setSort] = useState<SortBy>(SortBy.MOST_LIKED);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState(false);

  async function fetchMore() {
    setLoading(true);
    const res = await CoreApi.getComments(
      momentId,
      page.current,
      SortBy.MOST_LIKED
    );
    if (res.success) {
      setComments((prev) => [...(prev || []), ...(res.data?.items || [])]);
      setHasNextPage(res.data?.hasNextPage || false);
      page.current++;
    } else toast.error("Failed to load comments");
    setLoading(false);
  }

  async function handleComment(comment: CommentInfo) {
    const res = await CoreApi.comment(momentId, comment);
    if (res.success) setComments((prev) => [comment, ...(prev || [])]);
    else toast.error("Something went wrong!");
    return res.success;
  }

  function handleSort(value: SortBy) {
    if (!comments) return;
    setSort(value);
    const orderedComments = comments.sort((a, b) => {
      if (sort === SortBy.NEWEST)
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return a.likes - b.likes;
    });
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
    async function fetch() {
      const res = await CoreApi.getComments(momentId, 0, SortBy.MOST_LIKED);
      if (!res.success) throw new Error(res.message);
      setComments(res.data?.items || []);
      setHasNextPage(res.data?.hasNextPage || false);
    }

    toast.promise(fetch(), {
      loading: "Loading comments...",
      error: "Failed to load comments",
    });
  }

  useEffect(() => {
    async function fetch() {
      const res = await CoreApi.getComments(momentId, 0, SortBy.MOST_LIKED);
      if (res.success) setComments(res.data?.items || []);
      else setError(true);
      setLoaded(true);
    }
    fetch();
  }, [momentId]);

  let content = <CommentSkeletons />;
  if (loaded) {
    if (error)
      content = (
        <InformationWrapper>
          <ErrorContent onRefresh={refetch} />
        </InformationWrapper>
      );
    else if (comments.length === 0)
      content = (
        <InformationWrapper>
          <NoContent
            icon={
              <MessageSquareText className="size-12 text-muted-foreground" />
            }
            title="No comments"
            description="Be the first to comment on this moment."
          />
        </InformationWrapper>
      );
    else content = <>{children}</>;
  }

  return (
    <CommentDataContext.Provider
      value={{
        comments,
        setComments,
        handleComment,
        sort,
        sortBy: handleSort,
        loading,
        isExpanded,
        toggleExpansion,
        fetchMore,
        hasNextPage,
      }}
    >
      {content}
    </CommentDataContext.Provider>
  );
}

function InformationWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="pt-12 px-6 pb-6">{children}</div>;
}
