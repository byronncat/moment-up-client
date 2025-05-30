"use client";

import type { DetailedMoment, UserCardInfo } from "api";

import { useState, useEffect, memo } from "react";
import { cn } from "@/libraries/utils";
import dayjs from "dayjs";
import { UserApi } from "@/services";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/clientConfig";

import Image from "next/image";
import Link from "next/link";
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
  className?: string;
}>;

export default function MomentCard({ data, className }: MomentCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
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

  const MediaContent = memo(function MediaContent() {
    const [isCarouselMounted, setIsCarouselMounted] = useState(false);

    // Defer carousel mounting until after initial render
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsCarouselMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }, []);

    if (!postData.files) return null;

    return (
      <CardContent className="p-0">
        {isCarouselMounted ? (
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 574px"
                          className="object-cover"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPDY2ODYyTEhMR0BGRlNCRkJHYGFjYWM4OTtBV0ZGUJJgdmBwoKD/2wBDARUXFx4aHh0eHCAdHyChOKE4oaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
        ) : (
          // Show a placeholder while carousel is mounting
          <div className="relative aspect-square">
            <Image
              src={postData.files[0].url}
              alt="Moment"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 574px"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPDY2ODYyTEhMR0BGRlNCRkJHYGFjYWM4OTtBV0ZGUJJgdmBwoKD/2wBDARUXFx4aHh0eHCAdHyChOKE4oaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        )}
      </CardContent>
    );
  });

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
      color: "pink-500",
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
      color: "sky-500",
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
      color: "green-500",
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
      color: "yellow-500",
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
      color: "blue-500",
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
  color: string;
  tooltip: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
};

function ActionButton({
  icon,
  color,
  count,
  tooltip,
  isActive = false,
  onClick,
}: ActionButtonProps) {
  let textClass = "";
  let hoverTextClass = "";
  let bgHoverClass = "";
  switch (color) {
    case "pink-500":
      textClass = "text-pink-500";
      hoverTextClass = "hover:text-pink-500";
      bgHoverClass = "group-hover:bg-pink-500/10";
      break;
    case "sky-500":
      textClass = "text-sky-500";
      hoverTextClass = "hover:text-sky-500";
      bgHoverClass = "group-hover:bg-sky-500/10";
      break;
    case "green-500":
      textClass = "text-green-500";
      hoverTextClass = "hover:text-green-500";
      bgHoverClass = "group-hover:bg-green-500/10";
      break;
    case "yellow-500":
      textClass = "text-yellow-500";
      hoverTextClass = "hover:text-yellow-500";
      bgHoverClass = "group-hover:bg-yellow-500/10";
      break;
    case "blue-500":
      textClass = "text-blue-500";
      hoverTextClass = "hover:text-blue-500";
      bgHoverClass = "group-hover:bg-blue-500/10";
      break;
    default:
      textClass = "";
      hoverTextClass = "";
      bgHoverClass = "";
  }

  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          isActive ? textClass : hoverTextClass,
          "cursor-pointer",
          buttonStyles.transition
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            bgHoverClass,
            buttonStyles.transition
          )}
        >
          {icon}
        </div>
        {count && <span>{format.number(count)}</span>}
      </button>
    </Tooltip>
  );
}

type HoverableComponentProps = ComponentProps<{
  userInfo: UserCardInfo;
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
