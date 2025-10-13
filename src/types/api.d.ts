declare module "api" {
  import type {
    NotificationType,
    SearchItemType,
    StoryBackground,
  } from "@/constants/server";
  import type { PublicId } from "cloudinary";

  type Uuid = string;
  type SnowflakeId = string;
  type Timestamptz = string;

  type API<T = void> = Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
  }>;

  interface ErrorDto {
    error: string;
    message: string | string[];
    statusCode: number;
  }

  interface PaginationDto<T> {
    total?: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    items: T[];
  }

  // === User ===
  interface AccountDto {
    id: Uuid;
    username: string;
    displayName: string | null;
    avatar: PublicId | null;
  }

  interface ProfileDto extends AccountDto {
    bio: string | null;
    backgroundImage: PublicId | null;
    followers: number;
    following: number;
    isFollower: boolean;
    isFollowing: boolean;
    isFollowRequest: boolean;
    isMuted: boolean;
    isProtected: boolean;
    hasStory: boolean;
  }

  interface UserSummaryDto extends AccountDto {
    bio: string | null;
    followers: number;
    following: number;
    isFollowing: boolean;
    hasStory: boolean;
    followedBy: {
      remainingCount: number;
      displayItems: Array<{
        id: Uuid;
        displayName: string;
        avatar: AccountDto["avatar"];
      }>;
    } | null;
  }

  // === Core ===
  interface PostDto {
    text: string | null;
    files: FileInfo[] | null;
    likes: number;
    comments: number;
    reposts: number;
    isLiked: boolean;
    isBookmarked: boolean;
    lastModified: Timestamptz;
  }

  interface FeedItemDto {
    id: SnowflakeId;
    user: UserSummaryDto;
    post: PostDto;
  }

  interface CommentDto {
    id: string;
    user: UserSummaryDto;
    text: string;
    likes: number;
    isLiked: boolean;
    lastModified: string;
  }

  // === Others ===
  interface HashtagDto {
    name: string;
    count: number;
  }

  interface FileInfo {
    id: PublicId;
    type: "image" | "video";
    aspectRatio: "square" | "portrait" | "landscape";
  }

  // +++ TODO: Refactor this +++

  // === Story ===
  type StoryNotificationInfo = {
    id: string;
    userId: string;
    username: string;
    displayName: string;
    avatar: AccountDto["avatar"];
    viewed: boolean;
    total: number;
    createdAt: string;
  };

  type StoryContent =
    | { type: "text"; text: string; background: StoryBackground }
    | {
        id: string;
        type: "image" | "video";
        url: string;
        aspectRatio: "9:16";
      };

  type StoryInfo = {
    user: Omit<AccountDto, "email">;
    stories: Array<{
      id: string;
      content: StoryContent;
      sound?: string;
      createdAt: string;
    }>;
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
    user: UserSummaryDto;
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

  type FollowRequestDto = {
    type: NotificationType.FOLLOW_REQUEST;
    data: UserSummaryDto;
  };

  type NotificationDto = FollowRequestDto & {
    viewed: boolean;
    createdAt: timestamptz;
  };

  // === Search ===
  interface QuerySearchItem {
    type: SearchItemType.QUERY;
    query: string;
  }

  interface UserSearchItem extends AccountDto {
    type: SearchItemType.USER;
  }

  interface PostSearchItem extends FeedItemDto {
    type: SearchItemType.POST;
  }

  interface MediaSearchItem extends FeedItemDto {
    type: SearchItemType.MEDIA;
  }

  type PopularUserDto = AccountDto &
    Pick<ProfileDto, "backgroundImage" | "bio">;

  type SearchItem =
    | UserSearchItem
    | QuerySearchItem
    | PostSearchItem
    | MediaSearchItem;

  // === Chat ===
  interface MessageDto {
    id: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    timestamp: string;
  }

  interface ContactDto {
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    timestamp: string;
    isActive: boolean;
    type: "user" | "group";
    members: Array<{
      id: string;
      name: string;
      avatar: string;
    }> | null;
  }

  interface UserStatusDto {
    id: string;
    name: string;
    avatar: string;
    isActive: boolean;
  }
}
