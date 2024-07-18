/* global module */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  'rules': {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    tabs: ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': 'warn',
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-implicit-any": "off"
  },
  // env: {
  //   'jest': true
  // },
"overrides": [
    {
      "files": ["tests/**/*"],
      "env": {
        "jest": true
      }
    }
  ]
}

