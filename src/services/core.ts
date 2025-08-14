import type { MomentInfo, CommentInfo } from "api";
import { Audience } from "@/constants/serverConfig";

import type { Token } from "@/components/providers/Auth";
import type { API, ErrorResponse } from "api";
import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

const apiRes = {
  getMoment: "success" as "error" | "empty" | "success",
  getComments: "success" as "error" | "success" | "empty",
  comment: "success" as "error" | "success",
  report: "success" as "error" | "success",
  toggleCommentLike: "success" as "error" | "success",
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
    ? ApiUrl.moment.like(data.momentId)
    : ApiUrl.moment.unlike(data.momentId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = data.shouldLike ? "Liked" : "Unliked";

  return await fetch(endpoint, {
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
    ? ApiUrl.moment.bookmark(data.momentId)
    : ApiUrl.moment.unbookmark(data.momentId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = data.shouldBookmark ? "Bookmarked" : "Unbookmarked";

  return await fetch(endpoint, {
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
  return await fetch(ApiUrl.moment.repost(data.momentId), {
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
  return await fetch(ApiUrl.story.delete(storyId), {
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
  return await fetch(ApiUrl.moment.getById(momentId), {
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

export async function addComment(
  momentId: string,
  text: string,
  token: Token
): API<CommentInfo | null> {
  return await fetch(ApiUrl.comment.add(momentId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      content: text,
    }),
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

export async function report(momentId: string) {
  console.log("Report feature is not implemented yet", momentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
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

export async function toggleCommentLike(commentId: string): API {
  console.log("Comment like feature is not implemented yet", commentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.toggleCommentLike === "error") {
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
