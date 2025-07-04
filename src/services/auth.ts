import { mockCurrentUsers } from "@/__mocks__";

import type { z } from "zod";
import type { Token, AccountInfo, API, UserInfo, UserProfileInfo } from "api";

import zodSchema from "@/libraries/zodSchema";
import { SERVER_HOST_URL } from "@/constants/serverConfig";

const apiRes = {
  signup: "Signup successful" as "Signup successful" | "Internal error",
  sendRecoveryEmail: "Recovery email sent" as
    | "Recovery email sent"
    | "Internal error",
  changePassword: "Password changed successfully" as
    | "Password changed successfully"
    | "Internal error",
  getAllAccounts: "Accounts fetched successfully" as
    | "Accounts fetched successfully"
    | "Internal error",
  switchAccount: "Account switched successfully" as
    | "Account switched successfully"
    | "Internal error",
};

const ApiUrl = {
  login: `${SERVER_HOST_URL}/v1/auth/login`,
  logout: `${SERVER_HOST_URL}/v1/auth/logout`,
  verify: `${SERVER_HOST_URL}/v1/auth/verify`,
  getCsrfToken: `${SERVER_HOST_URL}/v1/auth/csrf`,
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
      "X-CSRF-Token": csrfToken,
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

export async function logout(csrfToken: Token): API {
  return await fetch(ApiUrl.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
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

export async function verify(csrfToken: Token): API<{
  user: UserInfo;
  accessToken: Token;
}> {
  return await fetch(ApiUrl.verify, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
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

export async function signup(data: z.infer<typeof zodSchema.auth.signup>): API {
  console.log("signup", data);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });

  if (apiRes.signup === "Signup successful") {
    document.cookie = "session=123456789; max-age=3600; path=/";
    return {
      success: true,
      message: "Signup successful!",
    };
  }
  return {
    success: false,
    message: "Internal error" as const,
  };

  // return await fetch(apiRes.auth.signup, {
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

export async function sendRecoveryEmail(
  data: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
): API {
  console.log("sendRecoveryEmail", data);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });

  if (apiRes.sendRecoveryEmail === "Recovery email sent") {
    return {
      success: true,
      message: "Recovery email sent",
    };
  }
  return {
    success: false,
    message: "Internal error" as const,
  };
}

export async function changePassword(
  data: z.infer<typeof zodSchema.auth.changePassword>
): API {
  console.log("changePassword", data);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });

  if (apiRes.changePassword === "Password changed successfully") {
    return {
      success: true,
      message: "Password changed successfully",
    };
  }
  return {
    success: false,
    message: "Internal error" as const,
  };
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
