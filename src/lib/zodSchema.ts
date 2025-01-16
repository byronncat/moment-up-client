import { z } from "zod";

// TODO: Add more validation rules and refine functions
export const loginFormSchema = z.object({
  identity: z
    .string({
      message: "Username or Email is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Username or Email is required",
    }),
  password: z
    .string({
      message: "Password is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Password is required",
    }),
});

export const signupFormSchema = z.object({
  username: z
    .string({
      message: "Username is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Username is required",
    }),
  email: z
    .string({
      message: "Email is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Email is required",
    })
    .or(
      z.string().email({
        message: "Invalid email address",
      })
    ),
  password: z
    .string({
      message: "Password is required",
    })
    .refine((data) => data.trim() !== "", {
      message: "Password is required",
    }),
});
