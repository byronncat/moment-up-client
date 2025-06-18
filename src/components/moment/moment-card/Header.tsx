import type { DetailedMomentInfo } from "api";
import type { Actions } from "../../providers/MomentData";

import dayjs from "dayjs";
import format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import HoverableComponent from "./HoverInfo";
import { Avatar, Tooltip } from "../../common";
import { CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreHorizontal, UserMinus, UserPlus, Ban, Flag } from "lucide-react";

type HeaderProps = Readonly<{
  data: DetailedMomentInfo;
  actions: Actions;
}>;

export default function Header({ data, actions }: HeaderProps) {
  const user = data.user;
  const post = data.post;

  return (
    <CardHeader className={cn("p-3 space-y-0", "flex flex-row gap-2")}>
      <HoverableComponent
        userInfo={user}
        followHandler={() => actions.follow(data.id)}
      >
        <Avatar
          src={user.avatar}
          alt={`${user.displayName}'s avatar`}
          size="12"
        />
      </HoverableComponent>

      <div className={cn("flex flex-col", "mt-1 flex-1")}>
        <div className="flex items-center gap-1">
          <HoverableComponent
            userInfo={user}
            followHandler={() => actions.follow(data.id)}
          >
            <span
              className={cn(
                "font-semibold text-base/tight",
                "truncate max-w-[192px] md:max-w-[320px]"
              )}
            >
              {user.displayName}
            </span>
          </HoverableComponent>
          <span className="text-base/tight text-muted-foreground">·</span>
          <Tooltip
            content={dayjs(post.created_at).format("h:mm A MMM D, YYYY")}
          >
            <span className="text-sm/tight text-muted-foreground cursor-default">
              {format.date(post.created_at)}
            </span>
          </Tooltip>
        </div>
        <div className="w-fit">
          <HoverableComponent
            userInfo={user}
            followHandler={() => actions.follow(data.id)}
          >
            <span className="text-sm text-muted-foreground">
              @{user.username}
            </span>
          </HoverableComponent>
        </div>
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 rounded-full", "text-muted-foreground")}
            >
              <MoreHorizontal className="size-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              {user.isFollowing ? (
                <DropdownMenuItem
                  onClick={() => actions.follow(data.id)}
                  className="cursor-pointer"
                >
                  <UserMinus className="size-4 shrink-0" />
                  <span className="truncate">Unfollow @{user.username}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => actions.follow(data.id)}
                  className="cursor-pointer"
                >
                  <UserPlus className="size-4 shrink-0" />
                  <span className="truncate">Follow @{user.username}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => actions.block(data.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Ban className="size-4 shrink-0" />
                <span className="truncate">Block @{user.username}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => actions.report(data.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Flag className="size-4 shrink-0" />
              <span className="truncate">Report post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
}
