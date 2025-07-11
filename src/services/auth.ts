import { mockCurrentUsers } from "@/__mocks__";

import type { z } from "zod";
import type { Token, AccountInfo, API, UserInfo, UserProfileInfo } from "api";

import zodSchema from "@/libraries/zodSchema";
import { SERVER_HOST_URL } from "@/constants/serverConfig";

const apiRes = {
  getAllAccounts: "Accounts fetched successfully" as
    | "Accounts fetched successfully"
    | "Internal error",
  switchAccount: "Account switched successfully" as
    | "Account switched successfully"
    | "Internal error",
};

const ApiUrl = {
  login: `${SERVER_HOST_URL}/v1/auth/login`,
  signup: `${SERVER_HOST_URL}/v1/auth/register`,
  logout: `${SERVER_HOST_URL}/v1/auth/logout`,
  authenticate: `${SERVER_HOST_URL}/v1/auth/authenticate`,
  getCsrfToken: `${SERVER_HOST_URL}/v1/auth/csrf`,
  sendOtpEmail: `${SERVER_HOST_URL}/v1/auth/send-otp-email`,
  recoverPassword: `${SERVER_HOST_URL}/v1/auth/recover-password`,
};

export async function login(
  data: z.infer<typeof zodSchema.auth.login>,
  csrfToken: Token
): API<{
  user: UserInfo;
  accessToken: Token;
}> {
  return await fetch(ApiUrl.login, {
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
    .catch(async (error) => {
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
  csrfToken: Token
): API {
  return await fetch(ApiUrl.signup, {
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
    .catch(async (error) => {
      return {
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function logout(csrfToken: Token): API {
  return await fetch(ApiUrl.logout, {
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
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function authenticate(): API<{
  user: UserInfo;
  accessToken: Token;
}> {
  return await fetch(ApiUrl.authenticate, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "User verified successfully",
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function getCsrf(): API<{ csrfToken: Token }> {
  return await fetch(ApiUrl.getCsrfToken, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "CSRF token fetched successfully",
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error.message,
      };
    });
}

export async function sendOtpEmail(
  data: z.infer<typeof zodSchema.auth.sendOtpEmail>,
  csrfToken: Token
): API {
  return await fetch(ApiUrl.sendOtpEmail, {
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
    .catch(async (error) => {
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
  csrfToken: Token
): API {
  return await fetch(ApiUrl.recoverPassword, {
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
    .catch(async (error) => {
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
