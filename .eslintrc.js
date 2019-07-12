module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
    "eslint:recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-console": ["warn"],
    "react/prop-types": ["warn"],
    "no-unused-vars": ["warn"],
    "@typescript-eslint/explicit-member-accessibility": ["off"],
    "@typescript-eslint/no-empty-interface": ["off"],
    "@typescript-eslint/no-parameter-properties": ["off"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-object-literal-type-assertion": ["off"],
  },
};
