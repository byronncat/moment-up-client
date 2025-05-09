"use client";

import type { DetailedMoment, UserInfo } from "api";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { UserApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";

import { Avatar, UserInfoCard } from "../common";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import Tooltip from "../common/Tooltip";
import { Heart, Comment, Play, Pause, Share, Repeat, Bookmark } from "../icons";

type MomentCardProps = Readonly<{
  data: DetailedMoment;
}>;

export default function MomentCard({ data }: MomentCardProps) {
  return (
    <Card className="overflow-hidden">
      <Header data={data} />
      <Content momentId={data.id} postData={data.post} />
      <Footer postData={data.post} />
    </Card>
  );
}

type HeaderProps = ComponentProps<{
  data: DetailedMoment;
}>;

function Header({ data }: HeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  function followHandler(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowing) UserApi.unfollowUser(data.id);
    else UserApi.followUser(data.id);
    setIsFollowing((prev) => !prev);
  }

  return (
    <CardHeader className={cn("p-3 space-y-0", "flex flex-row gap-2")}>
      <HoverableComponent
        userInfo={data.user}
        isFollowing={isFollowing}
        followHandler={followHandler}
      >
        <Avatar
          src={data.user.avatar}
          alt={`${data.user.displayName}'s avatar`}
          size="12"
        />
      </HoverableComponent>
      <div className={cn("flex flex-col", "mt-1")}>
        <div className="flex items-center gap-1">
          <HoverableComponent
            userInfo={data.user}
            isFollowing={isFollowing}
            followHandler={followHandler}
          >
            <span
              className={cn(
                "font-semibold text-base/tight",
                "truncate max-w-[12rem] md:max-w-[20rem]"
              )}
            >
              {data.user.displayName}
            </span>
          </HoverableComponent>
          <span className="text-base/tight text-muted-foreground">·</span>
          <span className="text-sm/tight text-muted-foreground">
            {dayjs(data.post.created_at).fromNow()}
          </span>
        </div>
        <HoverableComponent
          userInfo={data.user}
          isFollowing={isFollowing}
          followHandler={followHandler}
        >
          <span className="text-sm text-muted-foreground">
            @{data.user.username}
          </span>
        </HoverableComponent>
      </div>
    </CardHeader>
  );
}

type ContentProps = ComponentProps<{
  momentId: DetailedMoment["id"];
  postData: DetailedMoment["post"];
}>;

function Content({ momentId, postData }: ContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const TextContent = () =>
    postData.text && (
      <CardContent className="px-3 pb-2">
        <p className={cn("wrap-break-word", !showFullText && "line-clamp-5")}>
          {postData.text}
        </p>
        {postData.text.length > 280 && !showFullText && (
          <button
            onClick={() => setShowFullText(true)}
            className={cn(
              "font-semibold text-sm text-muted-foreground",
              "cursor-pointer hover:underline"
            )}
          >
            Show more
          </button>
        )}
        {showFullText && (
          <button
            onClick={() => setShowFullText(false)}
            className={cn(
              "font-semibold text-sm text-muted-foreground",
              "cursor-pointer hover:underline"
            )}
          >
            Show less
          </button>
        )}
      </CardContent>
    );

  const MediaContent = () =>
    postData.files && (
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {postData.files.map((file, index) => (
              <CarouselItem key={index}>
                <Link href={ROUTE.MOMENT(momentId)}>
                  <div className="relative aspect-square">
                    {file.type === "image" ? (
                      <Image
                        src={file.url}
                        alt={`Moment ${index + 1}`}
                        fill
                        sizes="574px"
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div
                        className={cn("relative size-full", "cursor-pointer")}
                      >
                        <video
                          src={file.url}
                          className="size-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                        <div
                          className={cn(
                            "absolute inset-0",
                            "flex items-center justify-center",
                            "pointer-events-none"
                          )}
                        >
                          {isPlaying ? (
                            <Pause className="size-12 fill-white/80" />
                          ) : (
                            <Play
                              className="size-12 fill-white/80"
                              type="solid"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {postData.files.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </CardContent>
    );

  return (
    <div>
      <TextContent />
      <MediaContent />
    </div>
  );
}

type FooterProps = ComponentProps<{
  postData: DetailedMoment["post"];
}>;

const buttonStyles = {
  iconSize: "size-5",
  transition: "transition-colors duration-150 ease-in-out",
};

function Footer({ postData }: FooterProps) {
  const buttons = [
    {
      icon: (
        <Heart
          type={postData.isLiked ? "solid" : "regular"}
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            postData.isLiked
              ? "fill-pink-500"
              : "fill-muted-foreground group-hover:fill-pink-500"
          )}
        />
      ),
      hoverColor: "pink-500",
      count: postData.likes,
      tooltip: "Like",
      isActive: postData.isLiked,
    },
    {
      icon: (
        <Comment
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-sky-500",
            "translate-x-[1px]"
          )}
        />
      ),
      hoverColor: "sky-500",
      count: postData.comments,
      tooltip: "Comment",
    },
    {
      icon: (
        <Repeat
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-green-500"
          )}
        />
      ),
      hoverColor: "green-500",
      count: 73,
      tooltip: "Repost",
    },
    {
      icon: (
        <Bookmark
          type="regular"
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-yellow-500"
          )}
        />
      ),
      hoverColor: "yellow-500",
      tooltip: "Bookmark",
    },
    {
      icon: (
        <Share
          className={cn(
            buttonStyles.iconSize,
            buttonStyles.transition,
            "fill-muted-foreground group-hover:fill-blue-500"
          )}
        />
      ),
      hoverColor: "blue-500",
      tooltip: "Share",
    },
  ];

  return (
    <CardFooter className="p-3">
      <div
        className={cn(
          "flex items-center justify-between",
          "w-full",
          "text-muted-foreground"
        )}
      >
        {buttons.slice(0, 3).map((button) => (
          <ActionButton key={button.tooltip} {...button} />
        ))}

        <div className="flex items-center gap-1">
          {buttons.slice(3).map((button) => (
            <ActionButton key={button.tooltip} {...button} />
          ))}
        </div>
      </div>
    </CardFooter>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  hoverColor: string;
  count?: number;
  tooltip: string;
  isActive?: boolean;
  activeColor?: string;
  onClick?: () => void;
};

function ActionButton({
  icon,
  hoverColor,
  count,
  tooltip,
  isActive = false,
  activeColor,
  onClick,
}: ActionButtonProps) {
  const color = isActive ? activeColor || hoverColor : undefined;

  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          isActive ? `text-${color}` : `hover:text-${hoverColor}`,
          "cursor-pointer",
          buttonStyles.transition
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            `group-hover:bg-${hoverColor}/10`,
            buttonStyles.transition
          )}
        >
          {icon}
        </div>
        {count !== undefined && <span>{count}</span>}
      </button>
    </Tooltip>
  );
}

type HoverableComponentProps = ComponentProps<{
  userInfo: UserInfo;
  isFollowing: boolean;
  followHandler: (e: React.MouseEvent) => void;
}>;

function HoverableComponent({
  children,
  userInfo,
  isFollowing,
  followHandler,
}: HoverableComponentProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "inline-flex",
          "hover:opacity-80 transition-opacity duration-150 ease-in-out"
        )}
        asChild
      >
        <Link href={ROUTE.PROFILE(userInfo.username)}>{children}</Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-[18rem]">
        <UserInfoCard
          user={userInfo}
          isFollowing={isFollowing}
          onFollow={followHandler}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
