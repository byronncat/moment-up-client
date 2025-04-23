declare module "api" {
  import type { Moment, User } from "schema";
  type MomentUI = Moment &
    Pick<User, "username" | "avatar"> & {
      likes: number;
      comments: number;
      isLiked: boolean;
    };

  type API<T = void> = {
    success: boolean;
    message: string;
    data?: T;
  };

  // User
  type AccountInfo = {
    id: User["id"];
    username: User["username"];
    displayName: User["display_name"];
    avatar?: User["avatar"];
    verified: User["verified"];
  };

  type UserInfo = AccountInfo & {
    followers: number;
    following: number;
    bio?: User["bio"];
    followedBy?: {
      displayItems: {
        id: User["id"];
        displayName: User["display_name"];
        avatar: User["avatar"];
      }[];
      count: number;
    };
  };

  // Search
  type UserSearchItem = {
    id: number;
    type: "user";
    username: User["username"];
    displayName: User["display_name"];
    avatar: User["avatar"];
    verified: User["verified"];
  };

  type QuerySearchItem = {
    id: number;
    type: "search";
    query: string;
  };

  type HashtagSearchItem = {
    id: number;
    type: "hashtag";
    tag: string;
    count: number;
  };

  type SearchItem = UserSearchItem | QuerySearchItem | HashtagSearchItem;
}
