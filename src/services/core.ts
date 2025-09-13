import type { API, CommentInfo, ErrorResponse, MomentInfo } from "api";
import type { Audience } from "@/constants/server";

import type { Token } from "@/components/providers/Auth";
import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

const apiRes = {
  report: "success" as "error" | "success",
};

interface LikeDto {
  momentId: string;
  shouldLike: boolean;
}

interface BookmarkDto {
  momentId: string;
  shouldBookmark: boolean;
}

export async function like(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.post.like(data.momentId)
    : ApiUrl.post.unlike(data.momentId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = data.shouldLike ? "Liked" : "Unliked";

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
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function bookmark(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.post.bookmark(data.momentId)
    : ApiUrl.post.unbookmark(data.momentId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = data.shouldBookmark ? "Bookmarked" : "Unbookmarked";

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
        message: successMessage,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function repost(
  data: {
    momentId: string;
    text: string;
    audience: Audience;
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
    .catch((error: ErrorResponse) => {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function getMoment(momentId: string): API<MomentInfo | null> {
  return fetch(ApiUrl.post.getById(momentId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Moment fetched successfully",
        data: (await response.json()).moment,
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

interface CommentDto {
  content: string;
  momentId: string;
}

export async function addComment(
  data: CommentDto,
  token: Token
): API<CommentInfo | null> {
  return fetch(ApiUrl.comment.add, {
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
    .catch((error: ErrorResponse) => {
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
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}

export async function report(_momentId: string) {
  if (apiRes.report === "error") {
    return {
      success: false,
      message: "error",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: "ok",
    statusCode: 200,
  };
}

export async function likeComment(
  commentId: string,
  isLiked: boolean,
  token: Token
): API {
  return fetch(ApiUrl.comment[isLiked ? "like" : "unlike"](commentId), {
    method: isLiked ? "POST" : "DELETE",
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
        message: isLiked
          ? "Comment liked successfully"
          : "Comment unliked successfully",
        statusCode: response.status,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
      };
    });
}
