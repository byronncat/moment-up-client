import { mockCurrentUsers } from "@/__mocks__";

import type { z } from "zod";
import type {
  AccountInfo,
  API,
  UserInfo,
  UserProfileInfo,
  ErrorResponse,
} from "api";

import zodSchema from "@/libraries/zodSchema";
import { ApiUrl } from "./api.constant";

const apiRes = {
  getAllAccounts: "Accounts fetched successfully" as
    | "Accounts fetched successfully"
    | "Internal error",
  switchAccount: "Account switched successfully" as
    | "Account switched successfully"
    | "Internal error",
};

export async function login(
  data: z.infer<typeof zodSchema.auth.login>,
  csrfToken: string
): API<{
  accessToken: string;
  user: UserInfo;
}> {
  return await fetch(ApiUrl.auth.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": csrfToken,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Login successful",
        data,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function signup(
  data: z.infer<typeof zodSchema.auth.signup>,
  csrfToken: string
): API {
  return await fetch(ApiUrl.auth.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": csrfToken,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Signup successful",
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function logout(csrfToken: string): API {
  return await fetch(ApiUrl.auth.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": csrfToken,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Logout successful",
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
      };
    });
}

export async function csrf() {
  return await fetch(ApiUrl.auth.csrf, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = (await response.json()) as { csrfToken: string };
      if (!response.ok) throw data;
      return data.csrfToken;
    })
    .catch(() => {
      return "";
    });
}

export async function refresh() {
  return await fetch(ApiUrl.auth.refresh, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = (await response.json()) as { accessToken: string };
      if (!response.ok) throw data;
      return data.accessToken;
    })
    .catch(() => {
      return "";
    });
}

export async function getUser(accessToken: string): API<{ user: UserInfo }> {
  return await fetch(ApiUrl.auth.me, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "User fetched successfully",
        data,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: error.message as string,
      };
    });
}

export async function sendOtpEmail(
  data: z.infer<typeof zodSchema.auth.sendOtpEmail>,
  csrfToken: string
): API {
  return await fetch(ApiUrl.auth.sendOtpEmail, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": csrfToken,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Send successful",
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function recoverPassword(
  data: z.infer<typeof zodSchema.auth.recoverPassword>,
  csrfToken: string
): API {
  return await fetch(ApiUrl.auth.recoverPassword, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": csrfToken,
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Password changed successfully",
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function getAllAcounts(): API<AccountInfo[]> {
  console.log("getAllAcounts");
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  if (apiRes.getAllAccounts === "Accounts fetched successfully") {
    return {
      success: true,
      message: "Accounts fetched successfully",
      data: mockCurrentUsers,
    };
  }

  return {
    success: false,
    message: "Internal error" as const,
  };
}

export async function switchAccount(
  accountId: UserProfileInfo["id"]
): API<Omit<UserProfileInfo, "followedBy" | "isFollowing">> {
  console.log("switchAccount", accountId);
  const anotherUser = mockCurrentUsers.find((user) => user.id === accountId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: anotherUser,
      });
    }, 2000);
  });
}
