import { mockCurrentUsers } from "@/__mocks__";

import type { z } from "zod";
import type { UserAccountInfo, API, UserCardDisplayInfo } from "api";

import zodSchema from "@/libraries/zodSchema";

const apiRes = {
  login: "Login successful" as
    | "Login successful"
    | "Incorrect identity or password"
    | "Internal error",
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

export async function login(
  data: z.infer<typeof zodSchema.auth.login>
): Promise<API> {
  console.log("login", data);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });

  if (apiRes.login === "Login successful") {
    document.cookie = "session=123456789; max-age=3600; path=/";
    return {
      success: true,
      message: "Login successful!",
    };
  }
  if (apiRes.login === "Incorrect identity or password") {
    return {
      success: false,
      message: "Incorrect identity or password",
    };
  }
  return {
    success: false,
    message: "Internal error" as const,
  };

  // return await fetch(apiRes.auth.login, {
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
  console.log("logout");
  document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  return {
    success: true,
    message: "ok",
  };
  // return await fetch(apiRes.auth.logout, {
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

export async function verify(): Promise<
  API<Omit<UserCardDisplayInfo, "followedBy" | "isFollowing">>
> {
  console.log("verify");
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

  // return await fetch(apiRes.auth.verify, {
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

export async function sendRecoveryEmail(
  data: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
): Promise<API> {
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
): Promise<API> {
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

export async function getAllAcounts(): Promise<API<UserAccountInfo[]>> {
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
  accountId: UserCardDisplayInfo["id"]
): Promise<API<Omit<UserCardDisplayInfo, "followedBy" | "isFollowing">>> {
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
