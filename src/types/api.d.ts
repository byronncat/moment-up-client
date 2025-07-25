declare module "api" {
  import { SearchItemType } from "@/constants/serverConfig";

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

  interface PaginationInfo<T> {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    items: T[];
  }

  // === User ===
  interface AccountInfo {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
  }

  interface ProfileInfo extends AccountInfo {
    bio?: string;
    backgroundImage?: string;
    followers: number;
    following: number;
    hasFeed: boolean;
    isFollowing?: boolean;
  }

  // interface UserProfileInfo extends UserInfo {
  // }

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
  type PostInfo = {
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
    reposts: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };

  type MomentInfo = {
    id: string;
    user: UserCardDisplayInfo;
    post: PostInfo;
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

  // === Search ===
  interface UserSearchItem extends AccountInfo {
    type: SearchItemType.USER;
  }

  interface QuerySearchItem {
    type: SearchItemType.QUERY;
    id: string;
  }

  interface HashtagSearchItem extends Hashtag {
    type: SearchItemType.HASHTAG;
  }

  type SearchItem = UserSearchItem | QuerySearchItem | HashtagSearchItem;

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

  type ProfileSearchItem = Omit<
    UserProfileInfo,
    "followers" | "following" | "hasFeed"
  >;

  type SearchResult = {
    posts?: MomentInfo[];
    users?: AccountInfo[];
    hashtags?: Hashtag[];
  };

  // Core
  type FeedNotificationInfo = {
    id: string;
    userId: string;
    displayName: string;
    avatar?: string;
    viewed: boolean;
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
