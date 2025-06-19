import type { DetailedMomentInfo, UserProfileInfo } from "api";
import { mockProfile, mockMoments } from "@/__mocks__";
import type { API } from "api";
import { PAGE_CONFIG } from "@/constants/clientConfig";

const apiRes = {
  toggleFollow: "success" as "error" | "success",
  toggleBlock: "success" as "error" | "success",
};

export async function toggleFollow(userId: string): Promise<API> {
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

export async function toggleBlock(userId: string): Promise<API> {
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

export async function getProfile(
  username: string
): Promise<API<UserProfileInfo>> {
  console.log("getProfile", username);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    success: true,
    message: "User fetched successfully",
    data: mockProfile,
  };
}

export async function getMoments(
  type: "moments" | "media" | "likes",
  username: string,
  page: number
): Promise<API<DetailedMomentInfo[]>> {
  console.log("getMoments", type, username, page);
  const start = (page - 1) * PAGE_CONFIG.MOMENT_CELL_PAGE;
  const end = start + PAGE_CONFIG.MOMENT_CELL_PAGE;
  const filteredMoments =
    type === "moments" || type === "likes"
      ? mockMoments.filter((moment) => moment.user.username === username)
      : mockMoments.filter(
          (moment) =>
            moment.user.username === username &&
            moment.post.files &&
            moment.post.files.length > 0
        );
  const moments = filteredMoments.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    success: true,
    message: "Moments fetched successfully",
    data: moments,
  };
}
