declare module "api" {
  type API<T = void> = Promise<{
    success: boolean;
    message: string;
    data?: T;
  }>;

  interface ErrorResponse {
    error: string;
    message: string | string[];
    statusCode: number;
  }

  // === User ===
  interface AccountInfo {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
  }

  interface UserInfo extends AccountInfo {
    bio?: string;
    backgroundImage?: string;
    followers: number;
    following: number;
    hasFeed: boolean;
  }

  interface UserProfileInfo extends UserInfo {
    isFollowing?: boolean;
  }

  interface UserCardDisplayInfo
    extends Omit<UserProfileInfo, "backgroundImage"> {
    followedBy?: {
      count: number;
      displayItems: {
        id: string;
        displayName: string;
        avatar?: string;
      }[];
    };
  }

  // === Core ===
  type MomentInfo = {
    text?: string;
    files?: {
      id: string;
      type: "image" | "video" | "audio";
      url: string;
      aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
    }[];
    createdAt: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };

  type DetailedMomentInfo = {
    id: string;
    user: UserCardDisplayInfo;
    post: MomentInfo;
  };

  type CommentInfo = {
    id: string;
    content: string;
    user: UserCardDisplayInfo;
    likes: number;
    isLiked: boolean;
    createdAt: string;
  };

  // === Notification ===
  type SecurityNotification = {
    id: string;
    type: "security";
    userId: string;
    createdAt: string;
  };

  type CommunityNotification = {
    id: string;
    type: "social";
    user: UserCardDisplayInfo;
    createdAt: string;
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
  type Hashtag = {
    id: string;
    count: number;
  };

  type FileInfo = {
    id: string;
    type: "image" | "video" | "audio";
    url: string;
    aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
  };

  // Search
  interface UserSearchItem extends AccountInfo {
    type: "user";
  }

  interface QuerySearchItem {
    type: "search";
    id: string;
    query: string;
  }

  interface HashtagSearchItem extends Hashtag {
    type: "hashtag";
  }

  type SearchItem = UserSearchItem | QuerySearchItem | HashtagSearchItem;

  type ProfileSearchItem = Omit<
    UserProfileInfo,
    "followers" | "following" | "hasFeed"
  >;

  type SearchResult = {
    posts?: DetailedMomentInfo[];
    users?: AccountInfo[];
    hashtags?: Hashtag[];
  };

  // Core
  type FeedNotification = {
    id: string;
    userId: string;
    displayName: string;
    avatar?: string;
    viewed: boolean;
    latestFeedTime: string;
  };

  type FeedInfo = {
    user: AccountInfo & {
      isViewed: boolean;
    };
    feeds: {
      id: string;
      content:
        | string
        | {
            id: string;
            type: "image" | "video" | "audio";
            url: string;
            aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
          };
      sound?: {
        id: string;
        type: "image" | "video" | "audio";
        url: string;
        aspectRatio: "1:1" | "9:16" | "4:5" | "1.91:1";
      };
      createdAt: string;
    }[];
  };
}
