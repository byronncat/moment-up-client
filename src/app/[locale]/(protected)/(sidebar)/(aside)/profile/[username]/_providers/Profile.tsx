"use client";

// === Type ===
import type { ProfileDto } from "api";
import type { UpdateProfileDto } from "@/services/user";
import type { UserReportType } from "@/constants/server";

type ProfileContextType = {
  username: string;
  profile: ProfileDto;
  isSelf: boolean;
  canView: boolean;
  follow: () => Promise<void>;
  removeFollower: () => Promise<void>;
  mute: () => Promise<void>;
  block: () => Promise<void>;
  report: (reportType: UserReportType) => void;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;

  registerPostsRefresh: (refreshFn: () => void) => void;
};

// === Provider ===
import { createContext, use, useCallback, useRef } from "react";
import { useAuth, useKey, useRefreshApi } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { toast } from "sonner";
import { ApiUrl, UserApi } from "@/services";

import { cn } from "@/libraries/utils";
import ErrorContent from "@/components/common/ErrorContent";
import { Header, ProfileZone, ProfileZoneSkeleton } from "../_components";

const ProfileContext = createContext<ProfileContextType>({
  username: "",
  profile: {
    id: "",
    username: "",
    displayName: null,
    avatar: null,
    backgroundImage: null,
    bio: null,
    followers: 0,
    following: 0,
    isFollower: false,
    isFollowing: false,
    isFollowRequest: false,
    isMuted: false,
    isProtected: false,
    hasStory: false,
  },
  canView: false,
  isSelf: false,
  follow: async () => {},
  removeFollower: async () => {},
  mute: async () => {},
  block: async () => {},
  report: async () => {},
  updateProfile: async () => {},

  registerPostsRefresh: () => {},
});

export const useProfile = () => use(ProfileContext);

type ProfileProviderProps = {
  username: string;
  children: React.ReactNode;
};

export default function ProfileProvider({
  username,
  children,
}: ProfileProviderProps) {
  const { user, token, setUser } = useAuth();
  const { incrementPostKey } = useKey();
  const { data, error, isLoading, mutate } = useSWRImmutable(
    [ApiUrl.user.getProfile(username), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ profile: ProfileDto }>(url, token)
  );

  const refreshPostsRef = useRef<(() => void) | null>(null);
  const registerPostsRefresh = useCallback((refreshFn: () => void) => {
    refreshPostsRef.current = refreshFn;
  }, []);

  const profile = data?.profile;
  const isSelf = user?.username === username;
  const canView = (() => {
    if (!profile) return false;
    return profile.isFollowing || profile.username === user?.username
      ? true
      : !profile.isProtected;
  })();

  const followApi = useRefreshApi(UserApi.follow);
  async function follow() {
    if (!profile) return;

    const isFollowRequest = profile.isProtected && !profile.isFollowing;
    const _prev = profile;
    mutate(
      {
        profile: {
          ..._prev,
          ...(isFollowRequest
            ? {
                isFollowRequest: !_prev.isFollowRequest,
              }
            : {
                followers: _prev.followers + (_prev.isFollowing ? -1 : 1),
                isFollowing: !profile.isFollowing,
              }),
        },
      },
      { revalidate: false }
    );

    const { success, message } = await followApi({
      targetId: profile.id,
      shouldFollow: isFollowRequest
        ? !_prev.isFollowRequest
        : !_prev.isFollowing,
    });

    if (success) {
      incrementPostKey();
      refreshPostsRef.current?.();
    } else {
      mutate({ profile: _prev }, { revalidate: false });
      toast.error(
        message ||
          `Unable to ${isFollowRequest ? "accept" : "decline"} follow request.`
      );
    }
  }

  const removeFollowerApi = useRefreshApi(UserApi.removeFollower);
  async function removeFollower() {
    if (!profile) return;

    const _prev = profile;
    mutate(
      {
        profile: {
          ..._prev,
          following: _prev.following - 1,
          isFollower: false,
        },
      },
      { revalidate: false }
    );

    const { success, message } = await removeFollowerApi(profile.id);

    if (!success) {
      mutate({ profile: _prev }, { revalidate: false });
      toast.error(message || "Unable to remove this follower.");
    }
  }

  const muteApi = useRefreshApi(UserApi.mute);
  async function mute() {
    if (!profile) return;

    const _prev = profile;
    mutate(
      { profile: { ..._prev, isMuted: !profile.isMuted } },
      { revalidate: false }
    );

    const { success, message } = await muteApi({
      targetId: profile.id,
      shouldMute: !profile.isMuted,
    });

    if (!success) {
      mutate({ profile: _prev }, { revalidate: false });
      toast.error(
        message || `Unable to ${profile.isMuted ? "unmute" : "mute"} this user.`
      );
    }
  }

  const blockApi = useRefreshApi(UserApi.block);
  async function block() {
    if (!profile) return;

    const _prev = profile;
    mutate(
      {
        profile: {
          ..._prev,
          followers: _prev.isFollowing ? _prev.followers - 1 : _prev.followers,
          isFollowing: false,
        },
      },
      { revalidate: false }
    );

    const { success, message } = await blockApi({
      targetId: profile.id,
      shouldBlock: true,
    });

    if (!success) {
      mutate({ profile: _prev }, { revalidate: false });
      toast.error(message || "Unable to block user.");
    }
  }

  const reportApi = useRefreshApi(UserApi.reportUser);
  function report(reportType: UserReportType) {
    if (!profile) return;
    toast.promise(reportApi(profile.id, { type: reportType }), {
      loading: "Submitting report...",
      success: ({ success, message }) => {
        if (success) return "Report submitted. Our team will review it soon.";
        throw new Error(message);
      },
      error: (error) => error.message ?? "Submission failed. Try again later.",
    });
  }

  const updateProfileApi = useRefreshApi(UserApi.updateProfile);
  async function updateProfile(data: UpdateProfileDto) {
    if (!profile || !user) return;
    const { success, message } = await updateProfileApi(profile.id, data);

    if (success && data) {
      mutate({ profile: { ...profile, ...data } }, { revalidate: false });
      setUser({
        ...user,
        displayName: data.displayName ?? null,
        avatar: data.avatar ?? null,
      });
    } else toast.error(message || "Unable to update profile. Try again later.");
  }

  if (isLoading) return <ProfileZoneSkeleton />;
  if (error?.statusCode === 404)
    return (
      <div className={cn("w-full relative", "flex flex-col items-center")}>
        <Header className="w-full" />
        <div className={cn("w-full h-40 -mb-15", "bg-muted")} />
        <div className="size-28 rounded-full bg-card" />

        <div className={cn("mt-3 mb-10", "flex flex-col items-center w-full")}>
          <span className="font-semibold text-xl">{username}</span>
          <span className="text-muted-foreground text-sm">@{username}</span>
        </div>

        <ErrorContent
          hiddenIcon
          title="This account does not exist"
          description="Try searching for another."
        />
      </div>
    );
  if (error)
    return (
      <div>
        <Header />
        <ErrorContent onRefresh={mutate} className="pt-[80px]" />
      </div>
    );
  if (!profile) return null;

  return (
    <ProfileContext.Provider
      value={{
        username,
        profile,
        canView,
        isSelf,
        follow,
        removeFollower,
        mute,
        block,
        report,
        updateProfile,

        registerPostsRefresh,
      }}
    >
      {canView ? (
        children
      ) : (
        <>
          <Header />
          <ProfileZone />
        </>
      )}
    </ProfileContext.Provider>
  );
}
