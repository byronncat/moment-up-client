"use client";

import type { API, UserProfileInfo } from "api";
import { notFound } from "next/navigation";
import { createContext, useContext, use, useState, useRef } from "react";
import { UserApi } from "@/services";

const ProfileContext = createContext(
  {} as {
    username: string;
    profile: UserProfileInfo;
    isFollowing: boolean;
    follow: () => Promise<void>;
  }
);

export const useProfile = () => useContext(ProfileContext);

type ProfileProviderProps = {
  username: string;
  initialRes: Promise<API<UserProfileInfo>>;
  children: React.ReactNode;
};

export default function ProfileProvider({
  username,
  initialRes,
  children,
}: ProfileProviderProps) {
  const response = use(initialRes);
  const [isFollowing, setIsFollowing] = useState(
    response.data?.isFollowing ?? false
  );
  const loading = useRef(false);

  async function follow() {
    if (loading.current) return;
    loading.current = true;
    setIsFollowing((prev) => !prev);
    const { success } = await UserApi.toggleFollow(username);
    if (!success) setIsFollowing((prev) => !prev);
    loading.current = false;
  }

  if (!response.success || !response.data) notFound();
  return (
    <ProfileContext.Provider
      value={{ username, profile: response.data, isFollowing, follow }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
