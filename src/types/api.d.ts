declare module "api" {
  import type { Moment, User, HashtagItem } from "schema";

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

  // Items
  type UserSearchItem = AccountInfo & {
    type: "user";
  };

  type QuerySearchItem = {
    id: string;
    type: "search";
    query: string;
  };

  type HashtagSearchItem = HashtagItem & {
    type: "hashtag";
  };

  type SearchItem = UserSearchItem | QuerySearchItem | HashtagSearchItem;
}
