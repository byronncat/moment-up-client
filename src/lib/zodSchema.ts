import { z } from "zod";

export const loginFormSchema = z.object({
  identity: z.string().nonempty({
    message: "Username or email is required",
  }),
  password: z.string().nonempty({
    message: "Password is required",
  }),
});

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
});

export const verifyRecoverySchema = z
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

export const signupFormSchema = z.object({
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
