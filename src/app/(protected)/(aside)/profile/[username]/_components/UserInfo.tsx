"use client";

import type { UserProfileInfo } from "api";
import format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type UserInformationProps = Readonly<{
  data: UserProfileInfo;
}>;

export default function UserInfo({ data }: UserInformationProps) {
  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div
        className={cn("w-full h-40", "-mb-15 bg-muted")}
        style={{
          backgroundImage: `url(${data.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Avatar
        src={data.avatar}
        alt={`${data.username}'s profile`}
        size="26"
        ring
        showRing={data.hasFeed}
      />

      <div className={cn("mt-3 mb-6", "flex flex-col items-center")}>
        <span className="font-semibold text-xl">{data.username}</span>
        <span className="text-muted-foreground text-sm">@{data.username}</span>
        <p className="mt-3 text-muted-foreground">{data.bio}</p>
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {format.number(data.following ?? 0)}
          </span>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {format.number(data.followers ?? 0)}
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
