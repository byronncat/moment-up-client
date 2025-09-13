"use client";

// === Type ===
import type { ProfileDto } from "api";

type ProfileContextType = {
  username: string;
  profile: ProfileDto | undefined;
  isFollowing: boolean;
  follow: () => Promise<void>;
  mutate: () => void;
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
  profile: undefined,
  isFollowing: false,
  follow: async () => {},
  mutate: () => {},
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
  const { token } = useAuth();
  const {
    data: profileData,
    error,
    isLoading,
    mutate,
  } = useSWRImmutable(
    [ApiUrl.user.getProfile(username), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ profile: ProfileDto }>(url, token)
  );

  const [profile, setProfile] = useState<ProfileDto | undefined>(
    profileData?.profile
  );

  useEffect(() => {
    if (profileData?.profile) setProfile(profileData.profile);
  }, [profileData?.profile]);

  const isFollowing = profile?.isFollowing ?? false;

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow() {
    if (!profile) return;

    const _prev = profile;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            followers: prev.followers + (isFollowing ? -1 : 1),
            isFollowing: !isFollowing,
          }
        : prev
    );

    const { success, message } = await follow({
      targetId: profile.id,
      shouldFollow: !isFollowing,
    });

    if (success)
      setProfile((prev) =>
        prev ? { ...prev, isProtected: !prev.isProtected } : prev
      );
    else {
      setProfile(_prev);
      toast.error(message || "Failed to follow/unfollow");
    }
  }

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
        isFollowing,
        follow: handleFollow,
        mutate,
      }}
    >
      {profile.isProtected ? <ProfileZone data={profile} /> : children}
    </ProfileContext.Provider>
  );
}
