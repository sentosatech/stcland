import { config as baseConfig } from '../storybook/tailwind.config'

const config = {
  ...baseConfig,
  content: ['./src/**/*.tsx'],
}

export default config