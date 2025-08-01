import type { API, MomentInfo, ErrorResponse, ProfileInfo } from "api";
import type { Token } from "@/components/providers/Auth";
import { ApiUrl } from "./api.constant";

const apiRes = {
  toggleBlock: "success" as "error" | "success",
  getMoments: "success" as "error" | "success" | "empty",
};

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
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function getProfile(username: string): API<{
  profile: ProfileInfo;
}>  {
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
        message: error.message as string,
        statusCode: error.statusCode,
      };
    });
}

export async function toggleBlock(userId: string): API {
  console.log("toggleBlock", userId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.toggleBlock === "error")
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };

  return {
    success: true,
    message: "Block updated successfully",
    statusCode: 200,
  };
}

export async function getMoments(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: "all" | "media" | "tagged" | "likes" | "bookmarks",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  username: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page: number
): API<{ items: MomentInfo[]; hasNextPage: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return {
    success: false,
    message: "error",
    statusCode: 500,
  };
}
