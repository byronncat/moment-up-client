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
    })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message:
        "Only letters, numbers, dots, underscores, and hyphens are allowed",
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
        message:
          "Password must include at least three of the following: uppercase letter (A-Z), lowercase letter (a-z), number (0-9)",
      }
    ),
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
          message:
            "Password must include at least three of the following: uppercase letter (A-Z), lowercase letter (a-z), number (0-9)",
        }
      ),
    confirmPassword: z.string().nonempty({
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const search = z.object({
  query: z.string().nonempty({
    message: "Search query is required",
  }),
});

const zodSchema = {
  auth: {
    login,
    signup,
    sendRecoveryEmail,
    changePassword,
  },
  core: {
    search,
  },
};

export default zodSchema;
