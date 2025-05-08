declare module "api" {
  import type {
    Moment as MomentSchema,
    User,
    HashtagItem,
    Feed,
    File,
  } from "schema";

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

  // Core
  type FeedNotification = {
    id: Feed["id"];
    userId: User["id"];
    displayName: User["display_name"];
    avatar: User["avatar"];
    viewed: boolean;
    latestFeedTime: Date;
  };

  type FeedInfo = {
    user: AccountInfo & {
      isViewed: boolean;
    };
    feeds: {
      id: Feed["id"];
      content: Feed["content"];
      sound?: Feed["sound"];
      createdAt: Feed["created_at"];
    }[];
  };

  type MomentInfo = Omit<MomentSchema, "id" | "user_id"> & {
    likes: number;
    comments: number;
    isLiked: boolean;
  };

  type DetailedMoment = {
    id: MomentSchema["id"];
    user: UserInfo;
    post: MomentInfo;
  };

  type CellMoment = MomentInfo & {
    id: MomentSchema["id"];
  };
}
