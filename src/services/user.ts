import type { API, ErrorResponse, ProfileInfo } from "api";
import type { Token } from "@/components/providers/Auth";
import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

interface FollowDto {
  targetId: string;
  shouldFollow: boolean;
}

export async function follow(data: FollowDto, token: Token): API {
  const endpoint = data.shouldFollow
    ? ApiUrl.user.follow(data.targetId)
    : ApiUrl.user.unfollow(data.targetId);
  const method = data.shouldFollow ? "POST" : "DELETE";
  const successMessage = data.shouldFollow ? "Followed" : "Unfollowed";

  return await fetch(endpoint, {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getProfile(username: string): API<{
  profile: ProfileInfo;
}> {
  return await fetch(ApiUrl.user.getProfile(username), {
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
        message: "Profile fetched successfully",
        statusCode: response.status,
        data,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function toggleBlock(userId: string): API {
  console.log("toggleBlock", userId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    success: true,
    message: "Block updated successfully",
    statusCode: 200,
  };
}
