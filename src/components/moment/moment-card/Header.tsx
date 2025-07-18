import type { DetailedMomentInfo } from "api";
import type { Actions } from "../../providers/MomentData";

import dayjs from "dayjs";
import Format from "@/utilities/format";

import { cn } from "@/libraries/utils";
import HoverableComponent from "./HoverInfo";
import { Avatar, Tooltip } from "../../common";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreHorizontal, User, Ban, Flag } from "@/components/icons";

type HeaderProps = Readonly<{
  data: DetailedMomentInfo;
  actions: Pick<Actions, "follow" | "block" | "report">;
  sideButton?: React.ReactNode;
}>;

export default function Header({ data, actions, sideButton }: HeaderProps) {
  const user = data.user;
  const post = data.post;

  return (
    <div className={cn("px-4 pt-4 pb-3 space-y-0", "flex flex-row gap-2")}>
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
          <Tooltip content={dayjs(post.createdAt).format("h:mm A MMM D, YYYY")}>
            <span className="text-sm/tight text-muted-foreground cursor-default">
              {Format.date(post.createdAt)}
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

      <div className="ml-auto flex gap-2">
        <DropdownMenu>
          <Tooltip content="More options">
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
          </Tooltip>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              {user.isFollowing ? (
                <DropdownMenuItem
                  onClick={() => actions.follow(data.id)}
                  className="cursor-pointer"
                >
                  <User variant="minus" className="size-4 shrink-0" />
                  <span className="truncate">Unfollow @{user.username}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => actions.follow(data.id)}
                  className="cursor-pointer"
                >
                  <User variant="plus" className="size-4 shrink-0" />
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
        {sideButton}
      </div>
    </div>
  );
}
