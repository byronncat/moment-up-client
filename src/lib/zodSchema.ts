import { z } from "zod";

export const loginFormSchema = z.object({
  identity: z.string().nonempty({
    message: "Username or email is required",
  }),
  password: z.string().nonempty({
    message: "Password is required",
  }),
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
