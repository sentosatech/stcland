import { themeConfig } from '@stcland/components'

// const config = {
//   ...themeConfig,
//   content: ['./stories/**/*.stories.tsx'],
// }


const config = {
  ...themeConfig,
  content: ['./stories/**/*.stories.tsx'],
  theme: {
    ...themeConfig.theme, // Include existing theme settings
    extend: {
      colors: {
        primary: {
          main: '#1d4ed8',  // New primary color (for example)
          light: '#3b82f6', // New light variant
          dark: '#1e40af',  // New dark variant
          range: {
            // TODO: refine stuff, create a utils?
            // ...themeConfig?.theme?.extend?.colors?.primary?.range, // Include existing shades
            950: '#0e2a5a', // Example additional shade
          },
        },
        secondary: {
          main: 'purple'
        }
      },
    },
  },
}

// console.log(config.theme.extend.colors)

export default config