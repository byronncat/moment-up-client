import type { API, CommentDto, ErrorDto, FeedItemDto } from "api";
import type { PublicId, ResourceType } from "cloudinary";
import type { Token } from "@/components/providers/Auth";
import type {
  ContentPrivacy,
  ContentReportType,
  StoryBackground,
  StoryFontFamily,
} from "@/constants/server";

import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

interface CreatePostDto {
  text?: string | null;
  privacy?: ContentPrivacy | null;
  attachments?: Array<{ id: PublicId; type: ResourceType }> | null;
}

export async function createPost(data: CreatePostDto, token: Token): API {
  return fetch(ApiUrl.post.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Post created",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function updatePost(
  postId: string,
  data: Omit<CreatePostDto, "attachments">,
  token: Token
): API {
  return fetch(ApiUrl.post.update(postId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Post updated",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function deletePost(postId: string, token: Token): API {
  return fetch(ApiUrl.post.delete(postId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "The post has been deleted.",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface LikeDto {
  postId: string;
  shouldLike: boolean;
}

export async function likePost(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.post.like(data.postId)
    : ApiUrl.post.unlike(data.postId);
  const method = data.shouldLike ? "POST" : "DELETE";

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: data.shouldLike ? "Liked" : "Unliked",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface BookmarkDto {
  postId: string;
  shouldBookmark: boolean;
}

export async function bookmarkPost(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.post.bookmark(data.postId)
    : ApiUrl.post.unbookmark(data.postId);
  const method = data.shouldBookmark ? "POST" : "DELETE";

  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: data.shouldBookmark ? "Bookmarked" : "Unbookmarked",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function reportPost(
  postId: string,
  data: { type: ContentReportType },
  token: Token
): API {
  return fetch(ApiUrl.post.report(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Reported successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getPost(
  postId: string,
  token: Token
): API<FeedItemDto | null> {
  return fetch(ApiUrl.post.getById(postId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Post fetched successfully",
        data: (await response.json()).post,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getPostMetadata(postId: string): API<
  | {
      username: string;
      displayName: string | null;
      text: string | null;
      lastModified: string;
    }
  | undefined
> {
  return fetch(ApiUrl.post.getMetadata(postId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    next: {
      revalidate: 300, // 5 minutes
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      const data = await response.json();
      return {
        success: true,
        message: "Post metadata fetched successfully",
        data: data.metadata,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface CreateStoryDto {
  privacy: ContentPrivacy;
  text?: string;
  background?: StoryBackground;
  font?: StoryFontFamily;
  attachment?: { id: PublicId; type: ResourceType };
  sound?: PublicId;
}

export async function createStory(data: CreateStoryDto, token: Token): API {
  return fetch(ApiUrl.story.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Story created successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

// +++ TODO: Need to change momentId to postId +++
export async function repost(
  data: {
    momentId: string;
    text: string;
    audience: ContentPrivacy;
  },
  token: Token
): API {
  return fetch(ApiUrl.post.repost(data.momentId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      text: data.text,
      audience: data.audience,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Reposted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function deleteStory(storyId: string, token: Token): API {
  return fetch(ApiUrl.story.delete(storyId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Story deleted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface CreateCommentDto {
  text: string;
  postId: string;
}

export async function createComment(
  data: CreateCommentDto,
  token: Token
): API<CommentDto | null> {
  return fetch(ApiUrl.comment.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Comment added successfully",
        data: (await response.json()).comment,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function deleteComment(commentId: string, token: Token): API {
  return fetch(ApiUrl.comment.delete(commentId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Comment deleted successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function likeComment(
  commentId: string,
  shouldLike: boolean,
  token: Token
): API {
  return fetch(ApiUrl.comment[shouldLike ? "like" : "unlike"](commentId), {
    method: shouldLike ? "POST" : "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: shouldLike
          ? "Comment liked successfully"
          : "Comment unliked successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}
