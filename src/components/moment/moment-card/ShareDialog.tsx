import type { UserCardDisplayInfo } from "api";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { Audience } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Avatar from "../../common/Avatar";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu";
import { Globe, User, Shield, Lock, Chevron, Loader } from "@/components/icons";

type AudienceOption = {
  label: string;
  value: Audience;
  icon: React.ReactNode;
  description: string;
};

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    label: "Public",
    value: Audience.PUBLIC,
    icon: <Globe className="size-4" />,
    description: "Anyone can see this",
  },
  {
    label: "Friends",
    value: Audience.FRIENDS,
    icon: <User multiple className="size-4" />,
    description: "Only your friends",
  },
  {
    label: "Followers",
    value: Audience.FOLLOWERS,
    icon: <User variant="check" className="size-4" />,
    description: "People who follow you",
  },
  {
    label: "Verified",
    value: Audience.VERIFIED,
    icon: <Shield variant="check" className="size-4" />,
    description: "Only verified accounts",
  },
  {
    label: "Only me",
    value: Audience.ONLY_ME,
    icon: <Lock className="size-4" />,
    description: "Only you can see this",
  },
];

type ShareDialogProps = Readonly<{
  momentId: string;
  userData: UserCardDisplayInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export default function ShareDialog({
  momentId,
  userData,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience>(
    AUDIENCE_OPTIONS[0].value
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(data: { comment: string }) {
    setIsLoading(true);
    const res = await CoreApi.repost(momentId, {
      comment: data.comment,
      audience: selectedAudience,
    });
    if (res.success) {
      toast.success("Repost successful");
      reset();
      onOpenChange(false);
    } else toast.error("Something went wrong!");
    setIsLoading(false);
  }

  const selectedOption = AUDIENCE_OPTIONS.find(
    (opt) => opt.value === selectedAudience
  );

  const openIncludeDialog = () => {
    // TODO: Open dialog to select specific people to include
    console.log("Opening include people dialog");
  };

  const openExcludeDialog = () => {
    // TODO: Open dialog to select specific people to exclude
    console.log("Opening exclude people dialog");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className={cn("border-b", "py-3")}>
            <DialogTitle className="text-center text-lg font-semibold">
              Repost
            </DialogTitle>
            <DialogDescription
              className={cn(
                "text-center text-sm text-muted-foreground",
                "hidden"
              )}
            >
              Share this moment with your friends
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4 mt-4">
            <div className={cn("flex items-start gap-3", "mb-4")}>
              <Avatar
                src={userData.avatar}
                alt={userData.displayName}
                size="14"
              />
              <div className="flex flex-col gap-2 pt-0.5">
                <span className="font-semibold text-base leading-tight">
                  {userData.displayName}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "px-2 h-7",
                        "text-xs font-medium",
                        "flex items-center gap-1.5"
                      )}
                    >
                      {selectedOption?.icon}
                      {selectedOption?.label}
                      <Chevron direction="down" className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="right"
                    className="w-64"
                  >
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      Select audience
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {AUDIENCE_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3",
                            "p-2 h-auto",
                            "cursor-pointer"
                          )}
                          onClick={() => setSelectedAudience(option.value)}
                        >
                          <MenuItem
                            icon={option.icon}
                            label={option.label}
                            description={option.description}
                          />
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Advanced options
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-3",
                          "p-2 h-auto",
                          "cursor-pointer"
                        )}
                        onClick={openIncludeDialog}
                      >
                        <MenuItem
                          icon={<User variant="plus" className="size-4" />}
                          label="Include specific people"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-3",
                          "p-2 h-auto",
                          "cursor-pointer"
                        )}
                        onClick={openExcludeDialog}
                      >
                        <MenuItem
                          icon={<User variant="minus" className="size-4" />}
                          label="Exclude specific people"
                        />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="repost"
                  className={cn("mb-4 h-24 w-full", "break-all", "resize-none")}
                  placeholder="Say something about this content (optional)"
                  maxLength={200}
                  {...field}
                />
              )}
            />

            <div className="flex justify-end w-full">
              <Button
                className={cn(
                  "h-9 w-[100px] text-base",
                  "bg-primary text-primary-foreground"
                )}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Share"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MenuItem({
  icon,
  label,
  description,
}: Readonly<{ icon: React.ReactNode; label: string; description?: string }>) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center",
          "size-8 rounded-full",
          "bg-muted/60 dark:bg-muted"
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  );
}
