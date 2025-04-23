import type { API } from "api";

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
