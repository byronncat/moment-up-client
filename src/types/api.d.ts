declare module "api" {
  import type {
    Moment,
    User,
    Hashtag,
    Feed,
    Notification as NotificationSchema,
    Comment,
    File,
  } from "schema";

  type API<T = void> = {
    success: boolean;
    message: string;
    data?: T;
  };

  // === User ===
  type UserAccountInfo = {
    id: User["id"];
    username: User["username"];
    displayName: User["display_name"];
    avatar?: User["avatar"];
    verified: User["verified"];
  };

  type UserProfileInfo = UserAccountInfo & {
    bio?: User["bio"];
    backgroundImage?: User["background_image"];
    followers: number;
    following: number;
    hasFeed: boolean;
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
  type UserSearchItem = UserAccountInfo & {
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
    users?: UserAccountInfo[];
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
    user: UserAccountInfo & {
      isViewed: boolean;
    };
    feeds: {
      id: Feed["id"];
      content: Feed["content"];
      sound?: Feed["sound"];
      createdAt: Feed["created_at"];
    }[];
  };

  // Others
  type SecurityNotification = NotificationSchema & {
    type: "security";
    information: "login";
  };

  type CommunityNotification = NotificationSchema & {
    type: "community";
    information:
      | {
          type: "post" | "mention";
          avatar: User["avatar"];
          displayName: User["display_name"];
          content: string;
        }
      | {
          type: "follow";
          avatar: User["avatar"];
          displayName: User["display_name"];
        };
  };

  type Notification = SecurityNotification | CommunityNotification;
}
