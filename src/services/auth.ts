import type { z } from "zod";
import type { API } from "api";

import { loginFormSchema, signupFormSchema } from "@/lib/zodSchema";
import { SERVER_HOST_URL } from "@/constants/serverConfig";

const api = {
  login: `${SERVER_HOST_URL}/v1/auth/login`,
  logout: `${SERVER_HOST_URL}/v1/auth/logout`,
  signup: `${SERVER_HOST_URL}/v1/auth/signup`,
  verify: `${SERVER_HOST_URL}/v1/auth/verify`,
};

export async function login(
  data: z.infer<typeof loginFormSchema>
): Promise<API> {
  return await fetch(api.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: Array.isArray(err.message) ? err.message[0] : err.message,
      };
    });
}

export async function logout(): Promise<API> {
  return await fetch(api.logout, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: Array.isArray(err.message) ? err.message[0] : err.message,
      };
    });
}

export async function signup(
  data: z.infer<typeof signupFormSchema>
): Promise<API> {
  return await fetch(api.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: Array.isArray(err.message) ? err.message[0] : err.message,
      };
    });
}

export async function verify(): Promise<API> {
  return await fetch(api.verify, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: Array.isArray(err.message) ? err.message[0] : err.message,
      };
    });
}
