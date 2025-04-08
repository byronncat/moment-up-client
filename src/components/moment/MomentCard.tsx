import type { MomentUI } from "api";

import Image from "next/image";
import { useState } from "react";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Heart, Comment, User, Play, Pause, Share, Repeat, Bookmark } from "../icons";

type MomentCardProps = Readonly<{
  data: MomentUI;
}>;

export default function MomentCard({ data }: MomentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`}
              alt={`${data.username}'s avatar`}
            />
            <AvatarFallback className="bg-primary">
              <User className="size-4 fill-card" type="solid" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{data.username}</span>
            <span className="text-xs text-muted-foreground">
              {dayjs(data.created_at).fromNow()}
            </span>
          </div>
        </div>
      </CardHeader>

      {data.text && (
        <CardContent className="px-3 pb-2">
          <p className="text-sm whitespace-pre-wrap">{data.text}</p>
        </CardContent>
      )}

      {data.files && data.files.length > 0 && (
        <CardContent className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {data.files.map((file, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    {file.type === "image" ? (
                      <Image
                        src={file.url}
                        alt={data.text || "Moment image"}
                        fill
                        sizes="(min-width: 640px) 640px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className={cn("relative size-full", "cursor-pointer")}>
                        <video
                          src={file.url}
                          className="size-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                        <div className={cn("absolute inset-0", "flex items-center justify-center", "pointer-events-none")}>
                          {isPlaying ? (
                            <Pause className="size-12 fill-white/80" />
                          ) : (
                            <Play className="size-12 fill-white/80" type="solid" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {data.files.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </CardContent>
      )}

      <CardFooter className="p-3">
        <div
          className={cn(
            "flex items-center justify-between",
            "w-full",
            "text-muted-foreground"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex items-center gap-1",
                    data.isLiked ? "text-pink-500" : "hover:text-pink-500",
                    "cursor-pointer",
                    "transition-colors duration-150 ease-in-out"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      "group-hover:bg-pink-500/10",
                      "transition-colors duration-150 ease-in-out"
                    )}
                  >
                    <Heart
                      className={cn(
                        "size-5",
                        "transition-colors duration-150 ease-in-out",
                        data.isLiked
                          ? "fill-pink-500"
                          : "fill-muted-foreground group-hover:fill-pink-500"
                      )}
                      type={data.isLiked ? "solid" : "regular"}
                    />
                  </div>
                  <span>{data.likes}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
                  "text-xs",
                  "px-2 py-1 rounded-md",
                  "dark:border border-border shadow-md"
                )}
                sideOffset={6}
              >
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex items-center gap-1",
                    "hover:text-blue-500",
                    "cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      "group-hover:bg-blue-500/10",
                      "transition-colors duration-150 ease-in-out"
                    )}
                  >
                    <Comment
                      className={cn(
                        "size-5",
                        "fill-muted-foreground group-hover:fill-blue-500"
                      )}
                    />
                  </div>
                  <span>{data.comments}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
                  "text-xs",
                  "px-2 py-1 rounded-md",
                  "dark:border border-border shadow-md"
                )}
                sideOffset={6}
              >
                <p>Comment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex items-center gap-1",
                    "hover:text-green-500",
                    "cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      "group-hover:bg-green-500/10",
                      "transition-colors duration-150 ease-in-out"
                    )}
                  >
                    <Repeat
                      className={cn(
                        "size-5",
                        "fill-muted-foreground group-hover:fill-green-500"
                      )}
                    />
                  </div>
                  <span>73</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
                  "text-xs",
                  "px-2 py-1 rounded-md",
                  "dark:border border-border shadow-md"
                )}
                sideOffset={6}
              >
                <p>Repost</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "group flex items-center gap-1",
                      "hover:text-blue-500",
                      "cursor-pointer"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        "group-hover:bg-blue-500/10",
                        "transition-colors duration-150 ease-in-out"
                      )}
                    >
                      <Bookmark
                        className={cn(
                          "size-5",
                          "fill-muted-foreground group-hover:fill-blue-500"
                        )}
                        type="regular"
                      />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
                    "text-xs",
                    "px-2 py-1 rounded-md",
                    "dark:border border-border shadow-md"
                  )}
                  sideOffset={6}
                >
                  <p>Bookmark</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "group flex items-center gap-1",
                      "hover:text-blue-500",
                      "cursor-pointer"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        "group-hover:bg-blue-500/10",
                        "transition-colors duration-150 ease-in-out"
                      )}
                    >
                      <Share
                        className={cn(
                          "size-5",
                          "fill-muted-foreground group-hover:fill-blue-500"
                        )}
                      />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
                    "text-xs",
                    "px-2 py-1 rounded-md",
                    "dark:border border-border shadow-md"
                  )}
                  sideOffset={6}
                >
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
