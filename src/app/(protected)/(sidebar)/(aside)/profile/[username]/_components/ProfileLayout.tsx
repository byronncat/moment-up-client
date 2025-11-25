"use client";

import { type ProfileDto } from "api";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useHover } from "usehooks-ts";
import { useAuth } from "@/components/providers";
import { useProfile } from "../_providers/Profile";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/common";
import { AuthenticatedButtons } from "../../../_components";
import { Arrow, Lock } from "@/components/icons";
import { sourceCodePro } from "@/styles/fonts";

type ProfileLayoutProps = Readonly<{
  children: React.ReactNode;
  tabs?: React.ReactNode;
}>;

export default function ProfileLayout({ children, tabs }: ProfileLayoutProps) {
  const { profile, isSelf } = useProfile();

  return (
    <div className="size-full relative">
      <div
        className={cn(
          "sticky top-0 left-0 z-10 w-full",
          "bg-background/90 backdrop-blur-md"
        )}
      >
        <Header profile={profile} isSelf={isSelf} />
        {tabs}
      </div>
      {children}
    </div>
  );
}

type HeaderProps = Readonly<{
  profile?: ProfileDto;
  isSelf?: boolean;
  className?: string;
}>;

export function Header({ profile, isSelf, className }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div
      className={cn(
        "flex items-center",
        "px-4 h-15",
        !user && "xl:hidden justify-between",
        className
      )}
    >
      {user ? (
        <>
          <Tooltip content="Back" side="bottom" sideOffset={8}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-6 rounded-full shrink-0"
            >
              <Arrow direction="left" className="size-5" />
            </Button>
          </Tooltip>
          {profile ? (
            <div className={cn("flex flex-col", "min-w-0", "mr-4")}>
              <div className={cn("flex items-center gap-1", "min-w-0")}>
                <h1 className="font-bold truncate">
                  {profile.displayName ?? profile.username}
                </h1>
                {profile.isProtected ? (
                  <Lock
                    className={cn(
                      "size-4 mt-0.5",
                      "text-muted-foreground",
                      "shrink-0"
                    )}
                  />
                ) : null}
              </div>
              <span className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </span>
            </div>
          ) : (
            <div className={cn("font-bold text-lg", "flex items-center")}>
              Profile
            </div>
          )}
          {isSelf !== undefined && !isSelf ? (
            <FollowButton className="shrink-0 ml-auto" />
          ) : null}
        </>
      ) : (
        <>
          <Link
            href={ROUTE.LOGIN}
            className={cn(
              "text-primary",
              "font-bold text-2xl tracking-wide",
              "select-none",
              sourceCodePro.className
            )}
          >
            MomentUp
          </Link>
          <AuthenticatedButtons />
        </>
      )}
    </div>
  );
}

function FollowButton({ className }: Readonly<{ className?: string }>) {
  const { profile, follow } = useProfile();
  const hoverRef = useRef<HTMLButtonElement>(null);
  const isHover = useHover(hoverRef as React.RefObject<HTMLElement>);

  function handleFollow() {
    follow();
  }

  return (
    <Button
      ref={hoverRef}
      size="sm"
      variant={
        profile.isFollowing ? (isHover ? "destructive" : "outline") : "default"
      }
      onClick={handleFollow}
      className={cn("w-[88px] cursor-pointer", className)}
    >
      {profile.isFollowing ? (isHover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}
