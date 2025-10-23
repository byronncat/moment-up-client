import { defineConfig, globalIgnores } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
  // === Next.js Core Web Vitals + TypeScript + Prettier ===
  ...nextVitals,
  ...nextTs,
  prettier,

  // === Custom overrides and additional rules ===
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // === TypeScript overrides ===
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

      // === JavaScript/General ===
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-alert": "error",
      "prefer-template": "error",
      "object-shorthand": "error",
      "prefer-destructuring": [
        "error",
        {
          array: false,
          object: true,
        },
      ],
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],

      // === React overrides ===
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-leaked-render": "error",
      "react/no-array-index-key": "warn",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react/prefer-stateless-function": "warn",

      // === Code quality ===
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-lonely-if": "error",
      "no-else-return": "error",
      "prefer-object-spread": "error",
      "no-useless-concat": "error",
      "no-template-curly-in-string": "error",
      "require-await": "error",
      "no-return-await": "error",
      "no-promise-executor-return": "error",
    },
  },
  {
    files: ["src/services/**/*.ts"],
    rules: {
      "require-await": "off",
    },
  },

  // === Override default ignores ===
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
