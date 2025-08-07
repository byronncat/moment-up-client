"use client";

import type { ProfileInfo } from "api";
import { notFound } from "next/navigation";
import { createContext, useContext, use, useState } from "react";
import { useRefreshApi } from "@/components/providers/Auth";
import { UserApi } from "@/services";

import ErrorContent from "@/components/common/ErrorContent";
import { ProfileZoneSkeleton } from "../_components";
import { toast } from "sonner";

type ProfileContextType = {
  username: string;
  profile: ProfileInfo;
  isFollowing: boolean;
  follow: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
  username: "",
  profile: {} as ProfileInfo,
  isFollowing: false,
  follow: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

type ProfileProviderProps = {
  username: string;
  api: ReturnType<typeof UserApi.getProfile>;
  children: React.ReactNode;
};

export default function ProfileProvider({
  username,
  api,
  children,
}: ProfileProviderProps) {
  const { success, statusCode, data } = use(api);
  const [_api, setApi] = useState({ success, statusCode });
  const [isLoaded, setLoaded] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | undefined>(
    data?.profile
  );
  const isFollowing = profile?.isFollowing || false;

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow() {
    setProfile((prev) =>
      prev ? { ...prev, isFollowing: !isFollowing } : prev
    );
    const { success, message } = await follow({
      targetId: username,
      shouldFollow: !isFollowing,
    });
    if (success)
      setProfile((prev) =>
        prev ? { ...prev, isFollowing: !isFollowing } : prev
      );
    else toast.error(message || "Failed to follow/unfollow");
  }

  async function handleRefresh() {
    setLoaded(false);
    const { success, statusCode, data } = await UserApi.getProfile(username);
    setApi({ success, statusCode });
    setProfile(data?.profile || undefined);
    setLoaded(true);
  }

  if (!isLoaded) return <ProfileZoneSkeleton />;
  if (_api.statusCode === 404) notFound();
  if (!_api.success || !profile) {
    return <ErrorContent onRefresh={handleRefresh} className="pt-[80px]" />;
  }
  return (
    <ProfileContext.Provider
      value={{
        username,
        profile,
        isFollowing,
        follow: handleFollow,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
