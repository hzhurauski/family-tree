module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 13,
      sourceType: 'module',
    },
    rules: {
      "no-undef": "error"
    },
  }