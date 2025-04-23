import { mockCurrentUsers } from "@/__mocks__";

import type { z } from "zod";
import type { AccountInfo, API } from "api";

import zodSchema from "@/lib/zodSchema";
// import { Api } from "@/constants/serverConfig";

export async function login(
  data: z.infer<typeof zodSchema.auth.login>
): Promise<API> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    // throw new Error("Not implemented");

    // create a cookie with the name "session" and value "123456789
    // set the cookie to expire in 1 hour
    document.cookie = "session=123456789; max-age=3600; path=/";
    return {
      success: true,
      message: "ok",
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }
  // return await fetch(Api.auth.login, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  //   credentials: "include",
  // })
  //   .then(async (res) => {
  //     const response = await res.json();
  //     if (!res.ok) throw response;
  //     return {
  //       success: true,
  //       message: response,
  //     };
  //   })
  //   .catch((err) => {
  //     return {
  //       success: false,
  //       message: Array.isArray(err.message) ? err.message[0] : err.message,
  //     };
  //   });
}

export async function logout(): Promise<API> {
  document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  return {
    success: true,
    message: "ok",
  };
  // return await fetch(Api.auth.logout, {
  //   method: "DELETE",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include",
  // })
  //   .then(async (res) => {
  //     const response = await res.json();
  //     if (!res.ok) throw response;
  //     return {
  //       success: true,
  //       message: response,
  //     };
  //   })
  //   .catch((err) => {
  //     return {
  //       success: false,
  //       message: Array.isArray(err.message) ? err.message[0] : err.message,
  //     };
  //   });
}

export async function signup(
  data: z.infer<typeof zodSchema.auth.signup>
): Promise<API> {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    // throw new Error("Not implemented");

    // create a cookie with the name "session" and value "123456789
    // set the cookie to expire in 1 hour
    document.cookie = "session=123456789; max-age=3600; path=/";
    return {
      success: true,
      message: "ok",
    };
  } catch (error) {
    return {
      success: false,
      message: "internal error",
    };
  }

  // return await fetch(Api.auth.signup, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  //   credentials: "include",
  // })
  //   .then(async (res) => {
  //     const response = await res.json();
  //     if (!res.ok) throw response;
  //     return {
  //       success: true,
  //       message: response,
  //     };
  //   })
  //   .catch((err) => {
  //     return {
  //       success: false,
  //       message: Array.isArray(err.message) ? err.message[0] : err.message,
  //     };
  //   });
}

export async function verify(): Promise<API<AccountInfo>> {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });

  return {
    success: true,
    message: "ok",
    data: mockCurrentUsers[0],
  };
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="));
  if (cookie) {
    return {
      success: true,
      message: "ok",
      data: mockCurrentUsers[0],
    };
  }
  return {
    success: false,
    message: "ok",
  };

  // return await fetch(Api.auth.verify, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include",
  // })
  //   .then(async (res) => {
  //     const response = await res.json();
  //     if (!res.ok) throw response;
  //     return {
  //       success: true,
  //       message: response,
  //     };
  //   })
  //   .catch((err) => {
  //     return {
  //       success: false,
  //       message: Array.isArray(err.message) ? err.message[0] : err.message,
  //     };
  //   });
}

export function sendRecoveryEmail(
  data: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
): Promise<API> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Recovery email sent to ${data.email}`,
      });
    }, 2000);
  });
}

export async function changePassword(
  data: z.infer<typeof zodSchema.auth.changePassword>
): Promise<API> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Password changed successfully`,
      });
    }, 2000);
  });
}

export async function getAllAcounts(): Promise<API<AccountInfo[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: mockCurrentUsers,
      });
    }, 2000);
  });
}

export async function switchAccount(
  accountId: AccountInfo["id"]
): Promise<API<AccountInfo>> {
  const anotherUser = mockCurrentUsers.find((user) => user.id !== accountId);
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
