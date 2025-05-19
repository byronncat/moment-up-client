"use client";

import type { ProfileInfo } from "api";
import { useState, useEffect } from "react";
import { UserApi } from "@/services";
import format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

export default function Information({
  username,
}: Readonly<{ username?: string }>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      const res = await UserApi.getProfile(username);
      if (res.success) setProfile(res.data ?? null);
      setIsLoaded(true);
    }
    fetchProfile();
  }, [username]);

  if (!isLoaded) return <UserInformationSkeleton />;

  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div
        className={cn("w-full h-40", "-mb-15 bg-muted")}
        style={{
          backgroundImage: `url(${profile?.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Avatar
        src={profile?.avatar}
        alt={`${username}'s profile`}
        size="26"
        ring
        showRing={profile?.hasFeed}
      />

      <div className={cn("mt-3 mb-6", "flex flex-col items-center")}>
        <span className="font-semibold text-xl">{username}</span>
        <span className="text-muted-foreground text-sm">@{username}</span>
        <p className="mt-3 text-muted-foreground">{profile?.bio}</p>
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {format.number(profile?.following ?? 0)}
          </span>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {format.number(profile?.followers ?? 0)}
          </span>
          <span>Followers</span>
        </div>
      </div>

      <Button
        className={cn(
          "my-5 px-5 py-2",
          "font-semibold text-sm",
          "absolute top-38 right-2"
        )}
        variant="outline"
      >
        <Settings />
        Edit profile
      </Button>
    </div>
  );
}

function UserInformationSkeleton() {
  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <Skeleton className={cn("w-full h-40", "-mb-15 bg-muted rounded-none")} />

      <Avatar size="26" ring showRing={false} />

      <div className={cn("mt-3 mb-6", "flex flex-col items-center")}>
        <Skeleton className="w-32 h-5 mt-1" />
        <Skeleton className="w-16 h-3 mt-2" />
        <Skeleton className="w-40 h-3 mt-5" />
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6 mt-2")}>
        <div className="flex flex-col items-center">
          <Skeleton className="w-10 h-4 mb-1" />
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="w-10 h-4 mb-1" />
          <span>Followers</span>
        </div>
      </div>
      {/* <Button
      className={cn(
        "my-5 px-5 py-2",
        "font-semibold text-sm",
        "absolute top-38 right-2"
      )}
      variant="outline"
    >
      <Settings />
      Edit profile
    </Button> */}
    </div>
  );
}
