import * as z from "zod";
import {
  MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants/server";

type LoginMessages = {
  identityRequired: string;
  passwordRequired: string;
};

const login = z.object({
  identity: z.string().min(1, {
    error: "Username or email is required",
  }),
  password: z.string().min(1, {
    error: "Password is required",
  }),
});

const createLoginSchema = (messages: LoginMessages) =>
  z.object({
    identity: z.string().min(1, {
      error: messages.identityRequired,
    }),
    password: z.string().min(1, {
      error: messages.passwordRequired,
    }),
  });

const signup = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === "" || issue.input === undefined)
        return "Email is required";
      return "Invalid email address";
    },
  }),
  username: z
    .string()
    .min(1, {
      error: "Username is required",
    })
    .min(MIN_USERNAME_LENGTH, {
      error: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
    })
    .max(MAX_NAME_LENGTH, {
      error: `Username must be less than ${MAX_NAME_LENGTH} characters`,
    })
    .refine((value) => !value.startsWith("."), {
      error: "Username cannot start with a dot",
    })
    .refine((value) => !value.endsWith("."), {
      error: "Username cannot end with a dot",
    })
    .refine((value) => !value.includes(".."), {
      error: "Username cannot contain consecutive dots",
    })
    .regex(/^[a-zA-Z0-9._]+$/, {
      error: "Only letters, numbers, underscores, and dots are allowed",
    }),
  password: z
    .string()
    .min(1, {
      error: "Password is required",
    })
    .min(MIN_PASSWORD_LENGTH, {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    })
    .refine(
      (password) => {
        let conditionsMet = 0;
        if (/[A-Z]/.test(password)) conditionsMet++;
        if (/[a-z]/.test(password)) conditionsMet++;
        if (/[0-9]/.test(password)) conditionsMet++;
        return conditionsMet >= 3;
      },
      {
        error:
          "Password must include at least three of the following: uppercase letter (A-Z), lowercase letter (a-z), number (0-9)",
      }
    ),
});

const sendOtp = z.object({
  identity: z.string().min(1, {
    error: "Username or email is required",
  }),
});

const recoverPassword = z
  .object({
    otp: z
      .string()
      .min(1, {
        error: "OTP is required",
      })
      .length(6, {
        error: "OTP must be 6 characters",
      })
      .regex(/^[A-Za-z0-9]+$/, {
        error: "OTP must contain only numbers and alphabetic characters",
      }),
    newPassword: z
      .string()
      .min(1, {
        error: "New password is required",
      })
      .min(MIN_PASSWORD_LENGTH, {
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      })
      .refine(
        (password) => {
          let conditionsMet = 0;
          if (/[A-Z]/.test(password)) conditionsMet++;
          if (/[a-z]/.test(password)) conditionsMet++;
          if (/[0-9]/.test(password)) conditionsMet++;
          return conditionsMet >= 3;
        },
        {
          error:
            "Password must include at least three of the following: uppercase letter (A-Z), lowercase letter (a-z), number (0-9)",
        }
      ),
    confirmPassword: z.string().min(1, {
      error: "Please confirm your password",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const search = z.object({
  query: z.string().min(1, {
    error: "Search query is required",
  }),
});

const zodSchema = {
  auth: {
    login,
    createLoginSchema,
    signup,
    sendOtp,
    recoverPassword,
  },
  core: {
    search,
  },
};

export default zodSchema;
