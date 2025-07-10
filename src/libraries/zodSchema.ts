import * as z from "zod";

const login = z.object({
  identity: z.string().min(1, {
    error: "Username or email is required",
  }),
  password: z.string().min(1, {
    error: "Password is required",
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
    .min(2, {
      error: "Username must be at least 2 characters",
    })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      error:
        "Only letters, numbers, dots, underscores, and hyphens are allowed",
    }),
  password: z
    .string()
    .min(1, {
      error: "Password is required",
    })
    .min(8, {
      error: "Password must be at least 8 characters",
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

const sendOtpEmail = z.object({
  identity: z.string().min(1, {
    error: "Username or email is required",
  }),
});

const changePassword = z
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
      .min(8, {
        error: "Password must be at least 8 characters",
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
    signup,
    sendOtpEmail,
    changePassword,
  },
  core: {
    search,
  },
};

export default zodSchema;
