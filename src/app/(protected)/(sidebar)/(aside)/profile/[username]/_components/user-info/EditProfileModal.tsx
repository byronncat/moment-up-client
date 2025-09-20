"use client";

import { __parseUrl } from "@/__mocks__";
import type { UpdateProfileDto } from "@/services/user";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../_providers/ProfileProvider";
import { useCloudinary } from "@/components/providers";
import { toast } from "sonner";
import { MAX_BIO_LENGTH, MAX_NAME_LENGTH } from "@/constants/server";

import { cn } from "@/libraries/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/common";
import { Image as ImageIcon, Loader, X } from "@/components/icons";

const FILE_SIZE_LIMIT = {
  "10M": 10 * 1024 * 1024,
};

type EditProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditProfileModal({
  open,
  onOpenChange,
}: EditProfileModalProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const { profile, updateProfile } = useProfile();
  const { uploadImage } = useCloudinary();
  const [isSaving, setIsSaving] = useState(false);

  // === Form State ===
  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  );

  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const backgroundPreview = useMemo(
    () => (backgroundFile ? URL.createObjectURL(backgroundFile) : null),
    [backgroundFile]
  );

  function revokeObjectURL(url: string | null) {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  useEffect(() => {
    return () => revokeObjectURL(avatarPreview);
  }, [avatarPreview]);
  useEffect(() => {
    return () => revokeObjectURL(backgroundPreview);
  }, [backgroundPreview]);

  const handleFileChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      type: "avatar" | "background"
    ) => {
      const file = event.target.files?.[0];

      if (!file) {
        toast.error("Please select an image file");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > FILE_SIZE_LIMIT["10M"]) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      if (file) {
        if (type === "avatar") setAvatarFile(file);
        else {
          setBackgroundFile(file);
          setIsBackgroundRemoved(false);
        }
      }

      event.target.value = "";
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const updates: UpdateProfileDto = {};

    updates.displayName = displayName ?? null;
    updates.bio = bio ?? null;

    if (avatarFile) {
      const { success, data } = await uploadImage(avatarFile);
      if (success) updates.avatar = data?.[0].public_id;
      else {
        setIsSaving(false);
        toast.error("Avatar upload failed. Please try again.");
        return;
      }
    }

    if (isBackgroundRemoved) updates.backgroundImage = null;
    if (backgroundFile) {
      const { success, data } = await uploadImage(backgroundFile);
      if (success) {
        updates.backgroundImage = data?.[0].public_id as string;
      } else {
        setIsSaving(false);
        toast.error("Background upload failed. Please try again.");
        return;
      }
    }

    if (Object.keys(updates).length > 0) {
      await updateProfile(updates);
      revokeObjectURL(avatarPreview);
      revokeObjectURL(backgroundPreview);
    }

    setIsSaving(false);
    onOpenChange(false);
  }, [
    displayName,
    bio,
    avatarFile,
    avatarPreview,
    backgroundFile,
    backgroundPreview,
    isBackgroundRemoved,
    updateProfile,
    uploadImage,
    onOpenChange,
  ]);

  const handleRemoveBackground = useCallback(() => {
    setBackgroundFile(null);
    setIsBackgroundRemoved(true);
  }, []);

  const handleReset = useCallback(() => {
    setDisplayName(profile.displayName ?? "");
    setBio(profile.bio ?? "");
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsBackgroundRemoved(false);

    revokeObjectURL(avatarPreview);
    revokeObjectURL(backgroundPreview);
  }, [profile, avatarPreview, backgroundPreview]);

  const handleCancel = useCallback(() => {
    handleReset();
    onOpenChange(false);
  }, [handleReset, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleReset();
        onOpenChange(open);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-full",
          "h-full sm:max-h-[640px] p-0",
          "border-0 sm:border",
          "rounded-none sm:rounded-lg overflow-hidden"
        )}
      >
        <ScrollArea className="h-full" thumbClassName="z-30">
          <DialogHeader
            className={cn(
              "absolute top-0 left-0 z-20",
              "w-full backdrop-blur-lg",
              "h-12 border-b border-border"
            )}
          >
            <DialogTitle className="px-6 py-4">Edit Profile</DialogTitle>
            <DialogDescription className="sr-only">
              Update your profile info and photo.
            </DialogDescription>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className={cn(
                "absolute top-2 right-3",
                "size-8 rounded-full",
                "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
              )}
            >
              <X className="size-4" />
            </Button>
          </DialogHeader>

          <div className="h-dvh sm:max-h-[640px] flex flex-col">
            <div className="pt-[48px]">
              <div>
                <div
                  className={cn("relative", "-mb-12", "w-full aspect-[3/1]")}
                >
                  <div
                    className={cn("size-full bg-muted", "flex justify-end")}
                    style={{
                      ...((backgroundPreview ?? profile.backgroundImage) &&
                        !isBackgroundRemoved && {
                          backgroundImage: `url(${__parseUrl(backgroundPreview ?? profile.backgroundImage, "image", 640)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "start",
                        }),
                    }}
                  >
                    <div className="flex gap-2 p-2">
                      <button
                        onClick={() => backgroundInputRef.current?.click()}
                        className={cn(
                          "size-9 rounded-full",
                          "flex items-center justify-center",
                          "bg-black/40 hover:bg-black/70",
                          "transition-colors ease-in-out",
                          "focus-indicator cursor-pointer"
                        )}
                      >
                        <ImageIcon
                          variant="plus"
                          className="size-4 text-white"
                        />
                      </button>
                      {(backgroundPreview ?? profile.backgroundImage) ? (
                        <button
                          onClick={handleRemoveBackground}
                          className={cn(
                            "size-9 rounded-full",
                            "flex items-center justify-center",
                            "bg-black/40 hover:bg-black/70",
                            "transition-colors ease-in-out",
                            "focus-indicator cursor-pointer"
                          )}
                        >
                          <X className="size-5 text-white" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, "background")}
                  className="hidden"
                />
              </div>

              <div className="mx-auto w-fit relative z-10">
                <div className="relative group">
                  <Avatar
                    src={__parseUrl(
                      avatarPreview ?? profile.avatar,
                      "image",
                      120,
                      120
                    )}
                    alt="Profile preview"
                    size="22"
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => avatarInputRef.current?.click()}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "transition-opacity duration-200 cursor-pointer",
                      "bg-black/30 rounded-full opacity-0 group-hover:opacity-100",
                      "focus-within:opacity-100 focus-indicator"
                    )}
                  >
                    <ImageIcon
                      variant="plus"
                      className="size-6 text-white/90"
                    />
                  </div>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, "avatar")}
                  className="hidden"
                />
              </div>

              <div
                className={cn(
                  "group",
                  "px-2.5 py-2 mt-6 mx-6",
                  "bg-input rounded-md",
                  "border border-border",
                  "shadow-xs transition-colors",
                  "focus-indicator"
                )}
              >
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    "flex items-center justify-between"
                  )}
                >
                  <label
                    htmlFor="displayName"
                    className="font-medium group-focus-within:text-foreground"
                  >
                    Name
                  </label>
                  <div>
                    {displayName.length}/{MAX_NAME_LENGTH}
                  </div>
                </div>

                <input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Enter display name"
                  maxLength={MAX_NAME_LENGTH}
                  className={cn(
                    "w-full py-1 mt-1",
                    "text-sm",
                    "bg-transparent focus:outline-none"
                  )}
                />
              </div>

              <div
                className={cn(
                  "group",
                  "px-2.5 py-2 mt-4 mx-6",
                  "bg-input rounded-md",
                  "border border-border",
                  "shadow-xs transition-colors",
                  "focus-indicator"
                )}
              >
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    "flex items-center justify-between"
                  )}
                >
                  <label
                    htmlFor="bio"
                    className="font-medium group-focus-within:text-foreground"
                  >
                    Bio
                  </label>
                  <div>
                    {bio.length}/{MAX_BIO_LENGTH}
                  </div>
                </div>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Write something about yourself..."
                  maxLength={MAX_BIO_LENGTH}
                  rows={3}
                  className={cn(
                    "w-full py-1 mt-1",
                    "text-sm",
                    "bg-transparent focus:outline-none",
                    "resize-none"
                  )}
                />
              </div>
            </div>

            <DialogFooter className="p-6 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader className="size-4 animate-spin" /> : null}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
