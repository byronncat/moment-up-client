import type { z } from "zod";
import type { API, AccountInfo, ErrorResponse } from "api";
import type { Token } from "@/components/providers/Auth";

import zodSchema from "@/libraries/zodSchema";
import { ApiUrl } from "./api.constant";

export async function login(
  data: z.infer<typeof zodSchema.auth.login>,
  csrfToken: string
): API<{
  accessToken: string;
  user: AccountInfo;
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
        statusCode: error.statusCode,
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function switchAccount(
  accountId: AccountInfo["id"],
  token: Token
): API<{
  accessToken: string;
  user: AccountInfo;
}> {
  return await fetch(ApiUrl.auth.switch, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify({ accountId }),
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Account switched successfully",
        data,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
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
        statusCode: error.statusCode,
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}

export async function logout(token: Token): API {
  return await fetch(ApiUrl.auth.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
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
        statusCode: error.statusCode,
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

export async function getUser(accessToken: string): API<{ user: AccountInfo }> {
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
        statusCode: error.statusCode,
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
        statusCode: error.statusCode,
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
        statusCode: error.statusCode,
        success: false,
        message: Array.isArray(error.message)
          ? error.message[0]
          : error.message,
      };
    });
}
