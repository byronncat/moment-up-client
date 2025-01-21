import type { MomentUI } from "api";

import Image from "next/image";
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
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { Heart, Comment, User } from "../icons";

type MomentCardProps = Readonly<{
  data: MomentUI;
}>;

export default function MomentCard({ data }: MomentCardProps) {
  const { username, profile_picture, caption, files, created_at } = data;

  return (
    <Card className={cn("max-w-md mx-auto", "rounded-md")}>
      <CardHeader className={cn("flex-row items-center", "p-4", "space-y-0")}>
        <Avatar>
          <AvatarImage
            src={
              profile_picture ||
              "https://res.cloudinary.com/dq02xgn2g/image/upload/v1711784076/default-avatar.jpg"
            }
            alt={`${username}'s profile`}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-5 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 mt-0">
          <p className="font-semibold text-sm">{username}</p>
          <p className="text-xs text-muted-foreground">
            {dayjs(created_at).format("MMMM D, YYYY")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {files.map((file, index) => (
              <CarouselItem key={index}>
                <div
                  className={cn(
                    "flex items-center justify-center",
                    "w-full aspect-[4/5]"
                  )}
                >
                  <div
                    className={cn(
                      "size-full",
                      "bg-muted",
                      "flex items-center justify-center"
                    )}
                  >
                    <img
                      src={file}
                      alt="Post content"
                      className={cn("object-cover", "block h-full w-auto")}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {files.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>

        <div className="p-4">
          {caption && (
            <p className="text-sm">
              <span className="font-semibold">{username} </span>
              {caption}
            </p>
          )}
        </div>
      </CardContent>

      <Separator />
      <CardFooter className={cn("flex items-center", "p-4 space-x-4")}>
        <div className="flex items-center gap-2">
          <Heart className="size-5 fill-red-500" type="solid" />
          <span className="text-sm text-muted-foreground">{data.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Comment className="size-5 fill-muted-foreground" />
          <span className="text-sm text-muted-foreground">{data.comments}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
