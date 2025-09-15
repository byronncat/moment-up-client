"use client";

// === Type ===
import type { ProfileDto } from "api";

type ProfileContextType = {
  username: string;
  profile: ProfileDto;
  isProtected: boolean;
  follow: () => Promise<void>;
  mute: () => Promise<void>;
  block: () => Promise<void>;
  report: () => Promise<void>;
};

// === Provider ===
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useRefreshApi } from "@/components/providers/Auth";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { toast } from "sonner";
import { ApiUrl, UserApi } from "@/services";

import { cn } from "@/libraries/utils";
import ErrorContent from "@/components/common/ErrorContent";
import { ProfileZone, ProfileZoneSkeleton } from "../_components";

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
    isFollowing: null,
    isMuted: null,
    isProtected: false,
    hasStory: false,
  },
  isProtected: false,
  follow: async () => {},
  mute: async () => {},
  block: async () => {},
  report: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

type ProfileProviderProps = {
  username: string;
  children: React.ReactNode;
};

export default function ProfileProvider({
  username,
  children,
}: ProfileProviderProps) {
  const { user, token } = useAuth();
  const { data, error, isLoading, mutate } = useSWRImmutable(
    [ApiUrl.user.getProfile(username), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ profile: ProfileDto }>(url, token)
  );

  const [profile, setProfile] = useState<ProfileDto | undefined>();
  const [isProtected, setIsProtected] = useState<boolean>(false);

  const followApi = useRefreshApi(UserApi.follow);
  async function follow() {
    if (!profile) return;

    const _prev = profile;
    setProfile({
      ..._prev,
      followers: _prev.followers + (profile.isFollowing ? -1 : 1),
      isFollowing: !profile.isFollowing,
    });

    const { success, message } = await followApi({
      targetId: profile.id,
      shouldFollow: !profile.isFollowing,
    });

    if (success) {
      if (profile.isProtected) setIsProtected(!isProtected);
    } else {
      setProfile(_prev);
      toast.error(message || "Failed to follow/unfollow");
    }
  }

  const muteApi = useRefreshApi(UserApi.mute);
  async function mute() {
    if (!profile) return;

    const _prev = profile;
    setProfile({
      ..._prev,
      isMuted: !profile.isMuted,
    });

    const { success, message } = await muteApi({
      targetId: profile.id,
      shouldMute: !profile.isMuted,
    });

    if (!success) {
      setProfile(_prev);
      toast.error(message || "Failed to mute user");
    }
  }

  const blockApi = useRefreshApi(UserApi.block);
  async function block() {
    if (!profile) return;

    const _prev = profile;
    setProfile({
      ..._prev,
      followers: _prev.isFollowing ? _prev.followers - 1 : _prev.followers,
      isFollowing: false,
    });

    const { success, message } = await blockApi({
      targetId: profile.id,
      shouldBlock: true,
    });

    if (success) setIsProtected(profile.isProtected);
    else {
      setProfile(_prev);
      toast.error(message || "Failed to block user");
    }
  }

  const reportApi = useRefreshApi(UserApi.reportUser);
  async function report() {
    if (!profile) return;

    const { success, message } = await reportApi(profile.id);

    if (success) toast.success(message || "User reported successfully");
    else toast.error(message || "Failed to report user");
  }

  useEffect(() => {
    if (data?.profile) {
      setProfile(data.profile);
      setIsProtected(
        data.profile.isFollowing || data.profile.username === user?.username
          ? false
          : data.profile.isProtected
      );
    }
  }, [data, user]);

  if (isLoading) return <ProfileZoneSkeleton />;
  if (error?.statusCode === 404)
    return (
      <div className={cn("w-full relative", "flex flex-col items-center")}>
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
  if (error || !profile)
    return <ErrorContent onRefresh={mutate} className="pt-[80px]" />;

  return (
    <ProfileContext.Provider
      value={{
        username,
        profile,
        isProtected,
        follow,
        mute,
        block,
        report,
      }}
    >
      {isProtected ? <ProfileZone /> : children}
    </ProfileContext.Provider>
  );
}
