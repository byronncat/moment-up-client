"use client";

import { __parseUrl } from "@/__mocks__";
import type { ProfileDto } from "api";

import { useRouter } from "next/navigation";
import { use } from "react";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { useAuth } from "@/components/providers";
import { ApiUrl } from "@/services";

import Image from "next/image";
import { Modal } from "@/components/common";

export default function HeaderPhotoModal({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const { username } = use(params);
  const router = useRouter();
  const { token } = useAuth();

  const { data, isLoading } = useSWRImmutable(
    [ApiUrl.user.getProfile(username), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ profile: ProfileDto }>(url, token)
  );

  function handleClose() {
    router.back();
  }

  if (isLoading || !data?.profile) return null;

  const headerUrl = __parseUrl(data.profile.backgroundImage, "image", 1920);
  if (!headerUrl) return null;

  return (
    <Modal onClose={handleClose} disableFocusTrap>
      <div className="relative size-full" onClick={handleClose}>
        <Image
          src={headerUrl}
          alt={`${data.profile.username}'s header photo`}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>
    </Modal>
  );
}
