// === Type ===
import type { z } from "zod";
import type { API, AccountDto, ErrorDto } from "api";
import type { Token } from "@/components/providers/Auth";
import type zodSchema from "@/libraries/zodSchema";

interface AuthDto {
  accessToken: string;
  user: AccountDto;
}

// === Service ===
import { ApiUrl } from "./api.constant";
import { parseErrorMessage } from "./helper";

export async function login(
  data: z.infer<typeof zodSchema.auth.login>,
  csrfToken: string
): API<AuthDto> {
  return fetch(ApiUrl.auth.login, {
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
        message: "Logged in.",
        statusCode: response.status,
        data,
      };
    })
    .catch((error: ErrorDto) => {
      return {
        success: false,
        message: parseErrorMessage(error),
        statusCode: error.statusCode,
        code: error.code,
      };
    });
}

export async function switchAccount(
  accountId: AccountDto["id"],
  token: Token
): API<AuthDto> {
  return fetch(ApiUrl.auth.switch, {
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
        message: "Account switched.",
        statusCode: response.status,
        data,
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

export async function signup(
  data: z.infer<typeof zodSchema.auth.signup>,
  csrfToken: string
): API {
  return fetch(ApiUrl.auth.signup, {
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
        message: "Signed up.",
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

export async function logout(token: Token): API {
  return fetch(ApiUrl.auth.logout, {
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
        message: "Logged out.",
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

export async function getCsrf() {
  return fetch(ApiUrl.auth.csrf, {
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
      return null;
    });
}

export async function refresh(): API<{
  accessToken: string;
  user: AccountDto;
}> {
  return fetch(ApiUrl.auth.refresh, {
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
        message: "Session refreshed.",
        statusCode: response.status,
        data,
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

export async function sendOtp(
  data: z.infer<typeof zodSchema.auth.sendOtp>,
  csrfToken: string
): API {
  return fetch(ApiUrl.auth.sendOtp, {
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
        message: "OTP sent.",
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

export async function recoverPassword(
  data: z.infer<typeof zodSchema.auth.recoverPassword>,
  csrfToken: string
): API {
  return fetch(ApiUrl.auth.recoverPassword, {
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
        message: "Password updated.",
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

export async function addGoogleAccount(
  token: Token
): API<{ user: AccountDto }> {
  return fetch(ApiUrl.auth.addGoogleAccount, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Csrf-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return {
        success: true,
        message: "Google account linked.",
        statusCode: response.status,
        data,
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
