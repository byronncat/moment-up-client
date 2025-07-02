declare module "api" {
  import type {
    Moment,
    User,
    Hashtag,
    Feed,
    Notification,
    Comment,
    File,
  } from "schema";

  type API<T = void> = Promise<{
    success: boolean;
    message: string;
    data?: T;
  }>;

  // === Auth ===
  type AccessToken = string;

  // === User ===
  type AccountInfo = {
    id: User["id"];
    username: User["username"];
    displayName: User["display_name"];
    avatar?: User["avatar"];
    verified: User["verified"];
  };

  type UserInfo = AccountInfo & {
    bio?: User["bio"];
    backgroundImage?: User["background_image"];
    followers: number;
    following: number;
    hasFeed: boolean;
  };

  type UserProfileInfo = UserInfo & {
    isFollowing?: boolean;
  };

  type UserCardDisplayInfo = Omit<UserProfileInfo, "backgroundImage"> & {
    followedBy?: {
      count: number;
      displayItems: {
        id: User["id"];
        displayName: User["display_name"];
        avatar: User["avatar"];
      }[];
    };
  };

  // === Core ===
  type MomentInfo = Omit<Moment, "id" | "user_id"> & {
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };

  type DetailedMomentInfo = {
    id: Moment["id"];
    user: UserCardDisplayInfo;
    post: MomentInfo;
  };

  type CommentInfo = {
    id: Comment["id"];
    content: Comment["content"];
    user: UserCardDisplayInfo;
    likes: number;
    isLiked: boolean;
    createdAt: Comment["created_at"];
  };

  // === Notification ===
  type SecurityNotification = {
    id: Notification["id"];
    type: "security";
    userId: Notification["user_id"];
    createdAt: Notification["created_at"];
  };

  type CommunityNotification = {
    id: Notification["id"];
    type: "social";
    user: UserCardDisplayInfo;
    createdAt: Notification["created_at"];
    information:
      | {
          type: "post" | "mention";
          content: string;
        }
      | {
          type: "follow";
        };
  };

  type NotificationInfo = SecurityNotification | CommunityNotification;

  // === Others ===
  type HashtagItem = Hashtag & {
    type: "hashtag";
    count: number;
  };

  type FileInfo = {
    id: File["id"];
    type: File["type"];
    url: File["url"];
    aspectRatio: File["aspect_ratio"];
  };

  // Search
  type UserSearchItem = AccountInfo & {
    type: "user";
  };

  type QuerySearchItem = {
    id: string;
    type: "search";
    query: string;
  };

  type SearchItem = UserSearchItem | QuerySearchItem | HashtagItem;

  type ProfileSearchItem = Omit<
    UserProfileInfo,
    "followers" | "following" | "hasFeed"
  >;

  type SearchResult = {
    posts?: DetailedMomentInfo[];
    users?: AccountInfo[];
    hashtags?: HashtagItem[];
  };

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
}
