module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "plugin:import/errors", "plugin:import/warnings"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-nested-ternary": ["off"],
    "arrow-body-style": ["error", "always"],
    "object-curly-newline": ["off"],
    "react/jsx-boolean-value": ["off"],
    "react/function-component-definition": ["off"],
    "react/prop-types": "off",
    "comma-dangle": ["off"],
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "linebreak-style": ["off"],
    quotes: ["off"],
    "import/extensions": ["off"],
    "import/named": 2,
    "import/export": 2,
    "import/order": ["off"],
    indent: ["off"],
    "import/no-extraneous-dependencies": ["off"],
    "react/jsx-one-expression-per-line": ["off"],
  },
};
