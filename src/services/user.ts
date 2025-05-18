import type { DetailedMoment, ProfileInfo } from "api";
import { mockProfile, mockMoments } from "@/__mocks__";
import type { API } from "api";
import { PAGE_CONFIG } from "@/constants/clientConfig";

export async function followUser(userId: string): Promise<API> {
  console.log("followUser", userId);
  return {
    success: true,
    message: "User followed successfully",
  };
}

export async function unfollowUser(userId: string): Promise<API> {
  console.log("unfollowUser", userId);
  return {
    success: true,
    message: "User unfollowed successfully",
  };
}

export async function getProfile(username: string): Promise<API<ProfileInfo>> {
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
): Promise<API<DetailedMoment[]>> {
  console.log("getMoments", username);
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
