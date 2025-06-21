"use client";

import type { DetailedMomentInfo } from "api";

import { createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { CoreApi, UserApi } from "@/services";
import { Link } from "lucide-react";

const MomentDataContext = createContext(
  {} as {
    moments: DetailedMomentInfo[] | undefined;
    getCurrentMoment: () => DetailedMomentInfo | undefined;
    setCurrentIndex: (index: number) => void;
    setMoments: (moments: DetailedMomentInfo[]) => void;
    addMoments: (moments: DetailedMomentInfo[]) => void;
    removeMoment: (momentId: string) => void;
    like: (momentId: string) => Promise<void>;
    bookmark: (momentId: string) => Promise<void>;
    follow: (momentId: string) => Promise<void>;
    block: (momentId: string, options?: { remove?: boolean }) => Promise<void>;
    share: (momentId: string) => void;
    report: (momentId: string) => Promise<void>;
  }
);

export const useMoment = () => useContext(MomentDataContext);

export type Actions = {
  like: (momentId: DetailedMomentInfo["id"]) => Promise<void>;
  bookmark: (momentId: DetailedMomentInfo["id"]) => Promise<void>;
  follow: (momentId: DetailedMomentInfo["id"]) => Promise<void>;
  block: (momentId: DetailedMomentInfo["id"]) => Promise<void>;
  share: (momentId: DetailedMomentInfo["id"]) => void;
  report: (momentId: DetailedMomentInfo["id"]) => Promise<void>;
  resetList?: (resetFn: () => void) => void;
};

type MomentDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: MomentDataProviderProps) {
  const [moments, setMoments] = useState<DetailedMomentInfo[] | undefined>(
    undefined
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  function getCurrentMoment() {
    return moments?.[currentIndex];
  }

  function addMoments(moments: DetailedMomentInfo[]) {
    if (moments) setMoments((prev) => [...(prev ?? []), ...moments]);
    setCurrentIndex(moments?.length ?? 0);
  }

  function removeMoment(momentId: string) {
    setMoments((prev) => prev?.filter((moment) => moment.id !== momentId));
  }

  function like(momentId: DetailedMomentInfo["id"]) {
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (foundMoment) {
      foundMoment.post.isLiked = !foundMoment.post.isLiked;
      setMoments((prev) =>
        prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
      );
    }
  }

  function follow(momentId: DetailedMomentInfo["id"]) {
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (foundMoment) {
      foundMoment.user.isFollowing = !foundMoment.user.isFollowing;
      setMoments((prev) =>
        prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
      );
    }
  }

  function bookmark(momentId: DetailedMomentInfo["id"]) {
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (foundMoment) {
      foundMoment.post.isBookmarked = !foundMoment.post.isBookmarked;
      setMoments((prev) =>
        prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
      );
    }
  }

  const undoBuffer = useRef<
    {
      blockedMoments: { index: number; moment: DetailedMomentInfo }[];
    }[]
  >([]);

  function block(
    userId: DetailedMomentInfo["user"]["id"],
    options?: { undo?: boolean; remove?: boolean }
  ) {
    if (!options?.remove) return;
    if (options?.undo) {
      const lastState = undoBuffer.current.pop();
      if (lastState)
        setMoments((prev) => {
          const newMoments = [...(prev ?? [])];
          lastState.blockedMoments.forEach(({ index, moment }) => {
            newMoments.splice(index, 0, moment);
          });
          return newMoments;
        });
    } else if (moments) {
      const blockedMoments: { index: number; moment: DetailedMomentInfo }[] =
        [];
      for (let index = moments.length - 1; index >= 0; index--) {
        const moment = moments[index];
        if (moment.user.id === userId) blockedMoments.push({ index, moment });
      }

      if (blockedMoments.length > 0) {
        undoBuffer.current.push({ blockedMoments });
        setMoments((prev) =>
          prev?.filter((moment) => moment.user.id !== userId)
        );
      }
    }
  }

  // == Actions ==
  const actionLoading = useRef<{
    like: boolean;
    follow: boolean;
    bookmark: boolean;
    mute: boolean;
    block: boolean;
    report: boolean;
  }>({
    like: false,
    follow: false,
    bookmark: false,
    mute: false,
    block: false,
    report: false,
  });

  async function handleLike(momentId: string) {
    if (actionLoading.current.like) return;
    actionLoading.current.like = true;
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (!foundMoment) return;
    like(momentId);
    const res = await CoreApi.toggleLike(momentId);
    if (!res.success) {
      like(momentId);
      toast.error("Something went wrong!");
    }
    actionLoading.current.like = false;
  }

  async function handleBookmark(momentId: string) {
    if (actionLoading.current.bookmark) return;
    actionLoading.current.bookmark = true;
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (!foundMoment) return;
    toast.promise(CoreApi.toggleBookmark(momentId), {
      loading: "Saving...",
      success: (res) => {
        if (res.success) {
          bookmark(momentId);
          return foundMoment.post.isBookmarked ? "Bookmarked" : "Unbookmarked";
        } else throw new Error(res.message);
      },
      error: () => "Something went wrong!",
    });
    actionLoading.current.bookmark = false;
  }

  async function handleReport(momentId: string) {
    if (actionLoading.current.report) return;
    actionLoading.current.report = true;
    toast.promise(CoreApi.report(momentId), {
      loading: "Reporting...",
      success: () => "Reported",
      error: () => "Something went wrong!",
    });
    actionLoading.current.report = false;
  }

  function handleShare(momentId: DetailedMomentInfo["id"]) {
    const url = window.location.href;
    const { origin } = new URL(url);
    navigator.clipboard.writeText(origin + "/moment/" + momentId);
    toast(
      <div className="flex items-center gap-2">
        <Link size={16} />
        <p>Copied to clipboard</p>
      </div>
    );
  }

  async function handleFollow(momentId: string) {
    if (actionLoading.current.follow) return;
    actionLoading.current.follow = true;
    const foundMoment = moments?.find((moment) => moment.id === momentId);
    if (!foundMoment) return;
    follow(momentId);
    const res = await UserApi.toggleFollow(foundMoment.user.id);
    if (!res.success) {
      follow(momentId);
      toast.error("Something went wrong!");
    }
    actionLoading.current.follow = false;
  }

  async function handleBlock(momentId: string, options?: { remove?: boolean }) {
    if (actionLoading.current.block) return;
    actionLoading.current.block = true;

    const userId = moments?.find((moment) => moment.id === momentId)?.user.id;
    if (!userId) return;
    block(userId, { remove: options?.remove });
    toast.loading("Waiting...");
    const res = await UserApi.toggleBlock(userId);
    toast.dismiss();
    if (res.success) {
      toast.success("Blocked", {
        action: {
          label: "Undo",
          onClick: async () => {
            toast.loading("Unblocking...");
            const res = await UserApi.toggleBlock(userId);
            if (res.success) {
              block(userId, { undo: true, remove: options?.remove });
              toast.dismiss();
              toast.success("Unblocked");
            } else toast.error("Something went wrong!");
          },
        },
      });
    } else {
      block(userId, { undo: true, remove: options?.remove });
      toast.error("Something went wrong!");
    }
    actionLoading.current.block = false;
  }

  return (
    <MomentDataContext.Provider
      value={{
        moments,
        getCurrentMoment,
        setMoments,
        setCurrentIndex,
        addMoments,
        removeMoment,
        like: handleLike,
        bookmark: handleBookmark,
        share: handleShare,
        follow: handleFollow,
        block: handleBlock,
        report: handleReport,
      }}
    >
      {children}
    </MomentDataContext.Provider>
  );
}
