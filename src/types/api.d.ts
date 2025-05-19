declare module "api" {
  import type {
    Moment as MomentSchema,
    User,
    HashtagItem,
    Feed,
    File,
    Notification as NotificationSchema,
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

  type ProfileInfo = AccountInfo & {
    bio?: User["bio"];
    backgroundImage?: User["background_image"];
    hasFeed: boolean;
    followers: number;
    following: number;
  };

  type UserCardInfo = Omit<ProfileInfo, "backgroundImage"> & {
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
    user: UserCardInfo;
    post: MomentInfo;
  };

  // Others
  type SecurityNotification = NotificationSchema & {
    type: "security";
    information: "login";
  };

  type CommunityNotification = NotificationSchema & {
    type: "community";
    information: {
      type: "post" | "mention";
      avatar: User["avatar"];
      displayName: User["display_name"];
      content: string;
    } | {
      type: "follow";
      avatar: User["avatar"];
      displayName: User["display_name"];
    };
  };

  type Notification = SecurityNotification | CommunityNotification;
}
