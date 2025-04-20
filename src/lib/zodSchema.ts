import { z } from "zod";

const login = z.object({
  identity: z.string().nonempty({
    message: "Username or email is required",
  }),
  password: z.string().nonempty({
    message: "Password is required",
  }),
});

const signup = z.object({
  username: z
    .string()
    .nonempty({
      message: "Username is required",
    })
    .min(2, {
      message: "Username must be at least 2 characters",
    }),
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string()
    .nonempty({
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

const sendRecoveryEmail = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
});

const changePassword = z
  .object({
    code: z
      .string()
      .nonempty({
        message: "Verification code is required",
      })
      .length(6, {
        message: "Verification code must be 6 digits",
      })
      .regex(/^\d+$/, {
        message: "Verification code must contain only numbers",
      }),
    newPassword: z
      .string()
      .nonempty({
        message: "New password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
    confirmPassword: z.string().nonempty({
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default {
  login,
  signup,
  sendRecoveryEmail,
  changePassword,
};
