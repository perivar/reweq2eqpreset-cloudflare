import { fixupPluginRules } from "@eslint/compat";
import eslintJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactRecommended from "eslint-plugin-react/configs/recommended.js";
import pluginTailwind from "eslint-plugin-tailwindcss";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    ignores: [
      "node_modules",
      ".cache",
      ".env",
      "build",
      "public",
      "*.config.ts",
    ],
  },
  {
    ...eslintJs.configs.recommended,
    ...pluginPrettierRecommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...pluginReactRecommended,
    ...pluginReactJSXRuntime,
    rules: {
      ...pluginReactRecommended.rules,
      ...pluginReactJSXRuntime.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "off",
      "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
      "react/prop-types": "off",
      "jsx-a11y/html-has-lang": "off",
      "jsx-a11y/heading-has-content": "off",
    },
    languageOptions: {
      ...pluginReactRecommended.languageOptions,
      ...pluginReactJSXRuntime.languageOptions,
    },
    plugins: {
      react: pluginReact,
      "react-hooks": fixupPluginRules(pluginReactHooks),
      ["jsx-a11y"]: pluginJsxA11y,
    },
    extends: [...pluginTailwind.configs["flat/recommended"]],
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
      "import/resolver": {
        typescript: {},
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: pluginImport,
      "unused-imports": pluginUnusedImports,
    },
    extends: [...eslintTs.configs.recommended],
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // Note: you must disable the base rule as it can report incorrect errors
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": [
        "warn",
        {
          ignoreTypeValueShadow: true,
          ignoreFunctionTypeParameterNameValueShadow: true,
        },
      ],
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
    },
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
