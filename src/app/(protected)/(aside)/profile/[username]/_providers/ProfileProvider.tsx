"use client";

import type { ProfileInfo } from "api";
import { notFound } from "next/navigation";
import { createContext, useContext, use, useState } from "react";
import { useRefreshApi } from "@/components/providers/Auth";
import { UserApi } from "@/services";

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
  const response = use(api);
  const [isFollowing, setIsFollowing] = useState(
    response.data?.profile.isFollowing ?? false
  );

  const follow = useRefreshApi(UserApi.follow);
  async function handleFollow() {
    setIsFollowing((prev) => !prev);
    const { success } = await follow({
      targetId: username,
      shouldFollow: !isFollowing,
    });
    if (!success) setIsFollowing((prev) => !prev);
  }

  if (!response.success || !response.data) notFound();
  return (
    <ProfileContext.Provider
      value={{
        username,
        profile: response.data.profile,
        isFollowing,
        follow: handleFollow,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
