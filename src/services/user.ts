import type { API, ErrorDto, ProfileDto } from "api";
import type { Token } from "@/components/providers/Auth";

import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

const SuccessMessage = {
  getProfile: "Profile loaded",
  updateProfile: "Profile updated",
  follow: "You're now following this user",
  unfollow: "Unfollowed",
  block: "User blocked",
  unblock: "User unblocked",
  mute: "User muted",
  unmute: "User unmuted",
};

export async function getProfile(username: string): API<{
  profile: ProfileDto;
}> {
  return fetch(ApiUrl.user.getProfile(username), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: SuccessMessage.getProfile,
        statusCode: response.status,
        data,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileDto,
  token: Token
): API {
  return fetch(ApiUrl.user.updateProfile(userId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const responseData = await response.json();
      if (!response.ok) throw responseData;
      return {
        success: true,
        message: SuccessMessage.updateProfile,
        statusCode: response.status,
        data: responseData,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface FollowDto {
  targetId: string;
  shouldFollow: boolean;
}

export async function follow(data: FollowDto, token: Token): API {
  const endpoint = data.shouldFollow
    ? ApiUrl.user.follow(data.targetId)
    : ApiUrl.user.unfollow(data.targetId);
  const method = data.shouldFollow ? "POST" : "DELETE";
  const successMessage = data.shouldFollow
    ? SuccessMessage.follow
    : SuccessMessage.unfollow;

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface BlockDto {
  targetId: string;
  shouldBlock: boolean;
}

export async function block(data: BlockDto, token: Token): API {
  const endpoint = data.shouldBlock
    ? ApiUrl.user.block(data.targetId)
    : ApiUrl.user.unblock(data.targetId);
  const method = data.shouldBlock ? "POST" : "DELETE";
  const successMessage = data.shouldBlock
    ? SuccessMessage.block
    : SuccessMessage.unblock;

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface MuteDto {
  targetId: string;
  shouldMute: boolean;
}

export async function mute(data: MuteDto, token: Token): API {
  const endpoint = data.shouldMute
    ? ApiUrl.user.mute(data.targetId)
    : ApiUrl.user.unmute(data.targetId);
  const method = data.shouldMute ? "POST" : "DELETE";
  const successMessage = data.shouldMute
    ? SuccessMessage.mute
    : SuccessMessage.unmute;

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

// +++ TODO: Ongoing +++
export async function reportUser(userId: string, token: Token): API {
  return fetch(ApiUrl.user.report(userId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "User reported successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export interface UpdateProfileDto {
  avatar?: string | null;
  displayName?: string | null;
  bio?: string | null;
  backgroundImage?: string | null;
}
