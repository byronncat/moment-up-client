"use client";

import type { MomentInfo } from "api";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useMemo,
} from "react";
import { toast } from "sonner";
import { CoreApi, UserApi } from "@/services";
import { Link } from "@/components/icons";

type MomentContextType = {
  moments: MomentInfo[] | undefined;
  getCurrentMoment: () => MomentInfo | undefined;
  setCurrentIndex: (index: number) => void;
  setMoments: (moments: MomentInfo[]) => void;
  addMoments: (moments: MomentInfo[]) => void;
  removeMoment: (momentId: string) => void;
  like: (momentId: string) => Promise<void>;
  bookmark: (momentId: string) => Promise<void>;
  follow: (momentId: string) => Promise<void>;
  block: (momentId: string, options?: { remove?: boolean }) => Promise<void>;
  share: (momentId: string) => void;
  report: (momentId: string) => Promise<void>;
};

export type Actions = {
  like: (momentId: MomentInfo["id"]) => Promise<void>;
  bookmark: (momentId: MomentInfo["id"]) => Promise<void>;
  follow: (momentId: MomentInfo["id"]) => Promise<void>;
  block: (momentId: MomentInfo["id"]) => Promise<void>;
  share: (momentId: MomentInfo["id"]) => void;
  report: (momentId: MomentInfo["id"]) => Promise<void>;
};

const MomentDataContext = createContext<MomentContextType>({
  moments: undefined,
  getCurrentMoment: () => undefined,
  setCurrentIndex: () => {},
  setMoments: () => {},
  addMoments: () => {},
  removeMoment: () => {},
  like: async () => {},
  bookmark: async () => {},
  follow: async () => {},
  block: async () => {},
  share: () => {},
  report: async () => {},
});

export const useMoment = () => useContext(MomentDataContext);

type MomentDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: MomentDataProviderProps) {
  const [moments, setMoments] = useState<MomentInfo[] | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCurrentMoment = useCallback(() => {
    return moments?.[currentIndex];
  }, [moments, currentIndex]);

  const addMoments = useCallback(
    (newMoments: MomentInfo[]) => {
      if (newMoments.length > 0) {
        setMoments((prev) => {
          const updated = [...(prev ?? []), ...newMoments];
          setCurrentIndex(updated.length - newMoments.length);
          return updated;
        });
      }
    },
    [setMoments, setCurrentIndex]
  );

  const removeMoment = useCallback(
    (momentId: string) => {
      setMoments((prev) => prev?.filter((moment) => moment.id !== momentId));
    },
    [setMoments]
  );

  const like = useCallback(
    (momentId: MomentInfo["id"]) => {
      const foundMoment = moments?.find((moment) => moment.id === momentId);
      if (foundMoment) {
        foundMoment.post.isLiked = !foundMoment.post.isLiked;
        setMoments((prev) =>
          prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
        );
      }
    },
    [moments]
  );

  const follow = useCallback(
    (momentId: MomentInfo["id"]) => {
      const foundMoment = moments?.find((moment) => moment.id === momentId);
      if (foundMoment) {
        foundMoment.user.isFollowing = !foundMoment.user.isFollowing;
        setMoments((prev) =>
          prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
        );
      }
    },
    [moments]
  );

  const bookmark = useCallback(
    (momentId: MomentInfo["id"]) => {
      const foundMoment = moments?.find((moment) => moment.id === momentId);
      if (foundMoment) {
        foundMoment.post.isBookmarked = !foundMoment.post.isBookmarked;
        setMoments((prev) =>
          prev?.map((moment) => (moment.id === momentId ? foundMoment : moment))
        );
      }
    },
    [moments]
  );

  const undoBuffer = useRef<
    {
      blockedMoments: { index: number; moment: MomentInfo }[];
    }[]
  >([]);

  const block = useCallback(
    (
      userId: MomentInfo["user"]["id"],
      options?: { undo?: boolean; remove?: boolean }
    ) => {
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
        const blockedMoments: { index: number; moment: MomentInfo }[] = [];
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
    },
    [moments]
  );

  // == Actions ==
  const actionLoading = useRef({
    like: false,
    follow: false,
    bookmark: false,
    mute: false,
    block: false,
    report: false,
  });

  const handleLike = useCallback(
    async (momentId: string) => {
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
    },
    [moments, like]
  );

  const handleBookmark = useCallback(
    async (momentId: string) => {
      if (actionLoading.current.bookmark) return;
      actionLoading.current.bookmark = true;
      const foundMoment = moments?.find((moment) => moment.id === momentId);
      if (!foundMoment) return;
      toast.promise(CoreApi.toggleBookmark(momentId), {
        loading: "Saving...",
        success: (res) => {
          if (res.success) {
            bookmark(momentId);
            return foundMoment.post.isBookmarked
              ? "Bookmarked"
              : "Unbookmarked";
          } else throw new Error(res.message);
        },
        error: () => "Something went wrong!",
      });
      actionLoading.current.bookmark = false;
    },
    [moments, bookmark]
  );

  const handleReport = useCallback(async (momentId: string) => {
    if (actionLoading.current.report) return;
    actionLoading.current.report = true;
    toast.promise(CoreApi.report(momentId), {
      loading: "Reporting...",
      success: () => "Reported",
      error: () => "Something went wrong!",
    });
    actionLoading.current.report = false;
  }, []);

  const handleShare = useCallback((momentId: MomentInfo["id"]) => {
    const url = window.location.href;
    const { origin } = new URL(url);
    navigator.clipboard.writeText(origin + "/moment/" + momentId);
    toast(
      <div className="flex items-center gap-2">
        <Link size={16} />
        <p>Copied to clipboard</p>
      </div>
    );
  }, []);

  const handleFollow = useCallback(
    async (momentId: string) => {
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
    },
    [moments, follow]
  );

  const handleBlock = useCallback(
    async (momentId: string, options?: { remove?: boolean }) => {
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
    },
    [moments, block]
  );

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      moments,
      getCurrentMoment,
      addMoments,
      removeMoment,
      handleLike,
      handleBookmark,
      handleShare,
      handleFollow,
      handleBlock,
      handleReport,
    ]
  );

  return (
    <MomentDataContext.Provider value={contextValue}>
      {children}
    </MomentDataContext.Provider>
  );
}
