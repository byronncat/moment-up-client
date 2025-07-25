"use client";

import type { MomentInfo } from "api";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/react-store";
import { toast } from "sonner";
import { CoreApi, UserApi } from "@/services";
import { Link } from "@/components/icons";
import { useRefreshApi } from "./hooks/useRefreshApi";

type MomentState = {
  moments: MomentInfo[] | undefined;
  currentIndex: number;
  actionLoading: {
    mute: boolean;
    block: boolean;
    report: boolean;
  };
  undoBuffer: {
    blockedMoments: { index: number; moment: MomentInfo }[];
  }[];
};

export type Actions = {
  like: (momentId: MomentInfo["id"]) => Promise<void>;
  bookmark: (momentId: MomentInfo["id"]) => Promise<void>;
  follow: (momentId: MomentInfo["id"]) => Promise<void>;
  block: (momentId: MomentInfo["id"]) => Promise<void>;
  share: (momentId: MomentInfo["id"]) => void;
  report: (momentId: MomentInfo["id"]) => Promise<void>;
};

const momentStore = new Store<MomentState>({
  moments: undefined,
  currentIndex: 0,
  actionLoading: {
    mute: false,
    block: false,
    report: false,
  },
  undoBuffer: [],
});

const momentActions = {
  setMoments: (moments: MomentInfo[]) => {
    momentStore.setState((state) => ({
      ...state,
      moments,
    }));
  },

  setCurrentIndex: (index: number) => {
    momentStore.setState((state) => ({
      ...state,
      currentIndex: index,
    }));
  },

  addMoments: (newMoments: MomentInfo[]) => {
    if (newMoments.length > 0) {
      momentStore.setState((state) => {
        const updated = [...(state.moments ?? []), ...newMoments];
        return {
          ...state,
          moments: updated,
          currentIndex: updated.length - newMoments.length,
        };
      });
    }
  },

  removeMoment: (momentId: string) => {
    momentStore.setState((state) => ({
      ...state,
      moments: state.moments?.filter((moment) => moment.id !== momentId),
    }));
  },

  toggleLikeState: (momentId: string) => {
    momentStore.setState((state) => ({
      ...state,
      moments: state.moments?.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              post: {
                ...moment.post,
                isLiked: !moment.post.isLiked,
                likes: moment.post.isLiked
                  ? moment.post.likes - 1
                  : moment.post.likes + 1,
              },
            }
          : moment
      ),
    }));
  },

  toggleBookmarkState: (momentId: string) => {
    momentStore.setState((state) => ({
      ...state,
      moments: state.moments?.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              post: {
                ...moment.post,
                isBookmarked: !moment.post.isBookmarked,
              },
            }
          : moment
      ),
    }));
  },

  toggleFollowState: (momentId: MomentInfo["id"]) => {
    momentStore.setState((state) => ({
      ...state,
      moments: state.moments?.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              user: {
                ...moment.user,
                isFollowing: !moment.user.isFollowing,
              },
            }
          : moment
      ),
    }));
  },

  toggleBlockState: (
    userId: MomentInfo["user"]["id"],
    options?: { undo?: boolean; remove?: boolean }
  ) => {
    if (!options?.remove) return;

    const state = momentStore.state;
    if (options?.undo) {
      const lastState = state.undoBuffer[state.undoBuffer.length - 1];
      if (lastState) {
        momentStore.setState((currentState) => {
          const newMoments = [...(currentState.moments ?? [])];
          lastState.blockedMoments.forEach(({ index, moment }) => {
            newMoments.splice(index, 0, moment);
          });
          return {
            ...currentState,
            moments: newMoments,
            undoBuffer: currentState.undoBuffer.slice(0, -1),
          };
        });
      }
    } else if (state.moments) {
      const blockedMoments: { index: number; moment: MomentInfo }[] = [];
      for (let index = state.moments.length - 1; index >= 0; index--) {
        const moment = state.moments[index];
        if (moment.user.id === userId) blockedMoments.push({ index, moment });
      }

      if (blockedMoments.length > 0) {
        momentStore.setState((currentState) => ({
          ...currentState,
          moments: currentState.moments?.filter(
            (moment) => moment.user.id !== userId
          ),
          undoBuffer: [...currentState.undoBuffer, { blockedMoments }],
        }));
      }
    }
  },

  setActionLoading: (
    key: keyof MomentState["actionLoading"],
    loading: boolean
  ) => {
    momentStore.setState((state) => ({
      ...state,
      actionLoading: {
        ...state.actionLoading,
        [key]: loading,
      },
    }));
  },

  report: async (momentId: string) => {
    const state = momentStore.state;
    if (state.actionLoading.report) return;

    momentActions.setActionLoading("report", true);
    toast.promise(CoreApi.report(momentId), {
      loading: "Reporting...",
      success: () => "Reported",
      error: () => "Something went wrong!",
    });
    momentActions.setActionLoading("report", false);
  },

  share: (momentId: MomentInfo["id"]) => {
    const url = window.location.href;
    const { origin } = new URL(url);
    navigator.clipboard.writeText(origin + "/moment/" + momentId);
    toast(
      <div className="flex items-center gap-2">
        <Link size={16} />
        <p>Copied to clipboard</p>
      </div>
    );
  },

  block: async (momentId: string, options?: { remove?: boolean }) => {
    const state = momentStore.state;
    if (state.actionLoading.block) return;

    momentActions.setActionLoading("block", true);

    const userId = state.moments?.find((moment) => moment.id === momentId)?.user
      .id;
    if (!userId) return;

    momentActions.toggleBlockState(userId, { remove: options?.remove });
    toast.loading("Waiting...");
    const { success } = await UserApi.toggleBlock(userId);
    toast.dismiss();

    if (success) {
      toast.success("Blocked", {
        action: {
          label: "Undo",
          onClick: async () => {
            toast.loading("Unblocking...");
            const { success } = await UserApi.toggleBlock(userId);
            if (success) {
              momentActions.toggleBlockState(userId, {
                undo: true,
                remove: options?.remove,
              });
              toast.dismiss();
              toast.success("Unblocked");
            } else toast.error("Something went wrong!");
          },
        },
      });
    } else {
      momentActions.toggleBlockState(userId, {
        undo: true,
        remove: options?.remove,
      });
      toast.error("Something went wrong!");
    }
    momentActions.setActionLoading("block", false);
  },
};

export const useMomentStore = () => {
  const state = useStore(momentStore);

  const getCurrentMoment = useCallback(() => {
    return state.moments?.[state.currentIndex];
  }, [state.moments, state.currentIndex]);

  return {
    ...state,
    getCurrentMoment,
    ...momentActions,
  };
};

// @deprecated

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
  const state = useStore(momentStore);
  const likeApi = useRefreshApi(CoreApi.like);
  const bookmarkApi = useRefreshApi(CoreApi.bookmark);
  const followApi = useRefreshApi(UserApi.follow);

  const getCurrentMoment = useCallback(() => {
    return state.moments?.[state.currentIndex];
  }, [state.moments, state.currentIndex]);

  const like = useCallback(
    async (momentId: string) => {
      const moment = state.moments?.find((m) => m.id === momentId);
      if (!moment) return;

      const shouldLike = !moment.post.isLiked;
      momentActions.toggleLikeState(momentId);

      const { success } = await likeApi({
        momentId,
        shouldLike,
      });

      if (!success) {
        momentActions.toggleLikeState(momentId);
        toast.error("Something went wrong! Please try again.");
      }
    },
    [state.moments, likeApi]
  );

  const bookmark = useCallback(
    async (momentId: string) => {
      const moment = state.moments?.find((m) => m.id === momentId);
      if (!moment) return;

      const shouldBookmark = !moment.post.isBookmarked;
      momentActions.toggleBookmarkState(momentId);

      const { success } = await bookmarkApi({
        momentId,
        shouldBookmark,
      });

      if (!success) {
        momentActions.toggleBookmarkState(momentId);
        toast.error("Something went wrong! Please try again.");
      }
    },
    [state.moments, bookmarkApi]
  );

  const follow = useCallback(
    async (momentId: string) => {
      const moment = state.moments?.find((m) => m.id === momentId);
      if (!moment) return;

      const shouldFollow = !moment.user.isFollowing;
      momentActions.toggleFollowState(momentId);

      const { success } = await followApi({
        targetId: moment.user.id,
        shouldFollow,
      });

      if (!success) {
        momentActions.toggleFollowState(momentId);
        toast.error("Something went wrong! Please try again.");
      }
    },
    [state.moments, followApi]
  );

  const contextValue = useMemo(
    () => ({
      moments: state.moments,
      getCurrentMoment,
      setMoments: momentActions.setMoments,
      setCurrentIndex: momentActions.setCurrentIndex,
      addMoments: momentActions.addMoments,
      removeMoment: momentActions.removeMoment,
      like,
      bookmark,
      share: momentActions.share,
      follow,
      block: momentActions.block,
      report: momentActions.report,
    }),
    [state.moments, getCurrentMoment, like, bookmark, follow]
  );

  return (
    <MomentDataContext.Provider value={contextValue}>
      {children}
    </MomentDataContext.Provider>
  );
}
