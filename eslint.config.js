import globals from "globals";
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin, // Define Jest plugin as an object
    },
    rules: {
      ...js.configs.recommended.rules, // Include ESLint's recommended rules
      ...jestPlugin.configs.recommended.rules, // Include Jest's recommended rules
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/valid-expect": "error",
    },
  },
];
