module.exports = {
  extends: 'eslint:recommended',
  root: true,
  env: { es6: true, browser: true },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  globals: {
    DEBUG: true,
    exports: true,
    process: true,
  },
  rules: {
    'block-scoped-var': 2,
    camelcase: 0,
    'new-cap': 1,
    'no-console': 0,
    'no-extend-native': 2,
    'no-unused-vars': 1,
    'no-undef': 1,
    'no-useless-escape': 1,
    'no-var': 1,
  },
};
