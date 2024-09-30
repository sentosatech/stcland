import baseConfig from '../config/.lintstagedrc.base.js'

export default {
  ...baseConfig,
  '*.{ts,tsx}': [
    () => 'pnpm ts-check',
  ],
}