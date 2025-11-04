"use client";

import { __parseUrl } from "@/__mocks__";
import type { ProfileDto } from "api";

import { useRouter } from "next/navigation";
import { use } from "react";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { useAuth } from "@/components/providers";

import { Modal } from "@/components/common";
import Image from "next/image";

export default function AvatarModal({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const { username } = use(params);
  const { token } = useAuth();
  const router = useRouter();

  const { data, isLoading } = useSWRImmutable(
    [ApiUrl.user.getProfile(username), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ profile: ProfileDto }>(url, token)
  );

  function handleClose() {
    router.back();
  }

  if (isLoading || !data?.profile) return null;

  const avatarUrl = __parseUrl(data.profile.avatar, "image", 1200);
  if (!avatarUrl) return null;

  return (
    <Modal onClose={handleClose} disableFocusTrap>
      <div className="relative size-48 md:size-64 rounded-full overflow-hidden">
        <Image
          src={avatarUrl}
          alt={`${data.profile.username}'s avatar`}
          fill
          className="object-cover object-top"
          priority
          sizes="(min-width: 768px) 256px, 192px"
        />
      </div>
    </Modal>
  );
}
