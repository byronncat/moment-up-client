import type { DetailedMomentInfo, UserProfileInfo } from "api";
import { mockProfile, mockMoments } from "@/__mocks__";
import type { API } from "api";

const apiRes = {
  toggleFollow: "success" as "error" | "success",
  toggleBlock: "success" as "error" | "success",
  getProfile: "success" as "error" | "success" | "not-found",
  getMoments: "success" as "error" | "success" | "empty",
};

export async function toggleFollow(userId: string): API {
  console.log("toggleFollow", userId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.toggleFollow === "error")
    return {
      success: false,
      message: "error",
    };

  return {
    success: true,
    message: "Follow updated successfully",
  };
}

export async function toggleBlock(userId: string): API {
  console.log("toggleBlock", userId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.toggleBlock === "error")
    return {
      success: false,
      message: "error",
    };

  return {
    success: true,
    message: "Block updated successfully",
  };
}

export async function getProfile(username: string): API<UserProfileInfo> {
  console.log("getProfile", username);
  if (apiRes.getProfile === "not-found")
    return {
      success: false,
      message: "error",
    };

  if (apiRes.getProfile === "error")
    return {
      success: false,
      message: "error",
    };

  await new Promise((resolve) => setTimeout(resolve, 12000));
  return {
    success: true,
    message: "User fetched successfully",
    data: mockProfile,
  };
}

export async function getMoments(
  type: "all" | "media" | "tagged" | "likes" | "bookmarks",
  username: string,
  page: number
): API<{ items: DetailedMomentInfo[]; hasNextPage: boolean }> {
  console.log("getMoments", type, username, page);
  await new Promise((resolve) => setTimeout(resolve, 4000));

  return {
    success: false,
    message: "error",
  };

  if (apiRes.getMoments === "empty")
    return {
      success: true,
      message: "Moments fetched successfully",
      data: {
        items: [],
        hasNextPage: false,
      },
    };

  if (apiRes.getMoments === "error")
    return {
      success: false,
      message: "Failed to fetch moments",
    };

  const filteredMoments =
    type === "all" ||
    type === "tagged" ||
    type === "likes" ||
    type === "bookmarks"
      ? mockMoments
      : mockMoments.filter(
          (moment) => moment.post.files && moment.post.files.length > 0
        );

  return {
    success: true,
    message: "Moments fetched successfully",
    data: {
      items: filteredMoments,
      hasNextPage: page < 10,
    },
  };
}
