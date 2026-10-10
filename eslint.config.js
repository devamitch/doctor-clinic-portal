import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const ERROR = "error";
const WARN = "warn";
const OFF = "off";

export default tseslint.config(
  // Base configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // TanStack Query
  ...pluginQuery.configs["flat/recommended"],

  // React configurations
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],

  // Prettier must be last
  eslintConfigPrettier,

  {
    languageOptions: {
      globals: {
        __DEV__: "readonly",
        console: "readonly",
        fetch: "readonly",
        global: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      "@tanstack/query": pluginQuery,
      import: importPlugin,
      perfectionist,
      "react-hooks": reactHooks,
      "react-native": reactNative,
      "react-refresh": reactRefresh,
    },

    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          moduleDirectory: ["node_modules", "src/"],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      react: {
        version: "detect",
      },
    },

    rules: {
      // ===== TANSTACK QUERY RULES =====
      "@tanstack/query/exhaustive-deps": ERROR,

      // ===== TYPESCRIPT RULES =====
      "@typescript-eslint/consistent-type-definitions": [ERROR, "type"],
      "@typescript-eslint/no-empty-function": OFF,
      "@typescript-eslint/no-explicit-any": WARN,
      "@typescript-eslint/no-unused-vars": [
        ERROR,
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // ===== REACT RULES =====
      ...reactHooks.configs.recommended.rules,
      "react/jsx-filename-extension": [ERROR, { extensions: [".tsx", ".jsx"] }],
      "react/jsx-key": ERROR,
      "react/jsx-no-duplicate-props": ERROR,
      "react/jsx-no-undef": ERROR,
      "react/jsx-uses-react": OFF,
      "react/jsx-uses-vars": ERROR,
      "react/no-children-prop": ERROR,
      "react/no-deprecated": ERROR,
      "react/no-unescaped-entities": OFF,
      "react/prop-types": OFF,
      "react/react-in-jsx-scope": OFF,

      // ===== REACT REFRESH RULES =====
      "react-refresh/only-export-components": OFF,

      // ===== REACT NATIVE RULES =====
      "react-native/no-raw-text": ERROR,
      "react-native/no-unused-styles": ERROR,

      // ===== IMPORT/EXPORT RULES =====
      "import/first": ERROR,
      "import/newline-after-import": ERROR,
      "import/no-duplicates": ERROR,
      "import/no-unresolved": OFF, // handled by TypeScript
      "import/order": OFF, // Using perfectionist instead

      // ===== PERFECTIONIST SORTING =====
      "perfectionist/sort-imports": [
        ERROR,
        {
          groups: [
            "side-effect",
            "type",
            ["builtin", "external"],
            "internal",
            "unknown",
          ],
          newlinesBetween: "always",
          type: "alphabetical",
        },
      ],

      // ===== GENERAL CODE QUALITY =====
      "no-console": [ERROR, { allow: ["warn", "error"] }],
      "no-debugger": ERROR,
      "no-var": ERROR,
      "prefer-const": ERROR,
    },
  },

  // ===== FILE-SPECIFIC OVERRIDES =====
  {
    files: [
      "*.conf.js",
      "*.config.js",
      "*.setup.js",
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
      "detox.config.js",
      "commitlint.config.js",
      "prettier.config.js",
      "eslint.config.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": OFF,
      "import/no-default-export": OFF,
      "no-undef": OFF,
    },
  },

  {
    files: [
      "**/*.spec.{js,ts,jsx,tsx}",
      "**/*.test.{js,ts,jsx,tsx}",
      "**/__tests__/**/*",
    ],
    plugins: {
      jest,
      "testing-library": testingLibrary,
    },
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "@typescript-eslint/no-explicit-any": OFF,
      "react-native/no-raw-text": OFF,
    },
  },

  // ===== IGNORE PATTERNS =====
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "reports/**",
      "docs/**",
      "*.min.js",
      "vendor/**",
      "public/**",
      ".expo/**",
      "ios/**",
      "android/**",
      ".storybook/**",
      "storybook-static/**",
      "patches/**",
      "plugins/**",
    ],
  }
);
