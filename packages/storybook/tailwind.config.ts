import { config } from '@stcland/components/theme'
import twColors from 'tailwindcss/colors'


const appTheme = {
  ...config,
  content: ['./src/**/*.tsx', './stc.config.ts', './stories/**/*.stories.tsx'],
  theme: {
    ...config.theme,
    extend: {
      colors: {
        // Theme basic palette
        'primary': {
          surface: {
            default: '#094AAC',
            light: '#1760CF',
            subtle: '#E7F0FE',
            dark: twColors.blue['950']
          },
          'text-icon': {
            default: twColors.indigo['300'],
            light: twColors.indigo['100'],
            dark: twColors.indigo['900'],
            disabled: twColors.neutral['400']
          },
          main: twColors.sky['400'],
          light: twColors.sky['200'],
          dark: twColors.sky['600'],
          range: twColors.sky
        },
        'secondary': {
          main: twColors.orange['400'],
          light: twColors.orange['200'],
          dark: twColors.orange['600'],
          range: twColors.orange
        },

        // Specific colors w/in app
        'link': twColors.sky['600'],
        neutral: {
          surface: {
            default: twColors.slate['50'],
            '1': twColors.white,
            '2': twColors.gray['50'],
            '3': twColors.gray['100'],
            disabled: twColors.neutral['300']
          },
          stroke: {
            default: twColors.neutral['200'],
            light: twColors.neutral['300'],
            dark: twColors.gray['500']
          },
          'text-icon' : {
            title: twColors.neutral['950'],
            body: twColors.slate['900'],
            label: twColors.gray['600'],
            disabled: twColors.neutral['400']
          }
        },
        states: {
          error: {
            default: twColors.red['700'],
            light: twColors.red['600'],
            subtle: twColors.red['400'],
            dark: twColors.red['800']
          },
          success: {
            default: twColors.green['700'],
            light: twColors.green['600'],
            subtle: twColors.green['300'],
            dark: twColors.green['700']
          },
          warning: {
            default: twColors.yellow['600'],
            light: twColors.yellow['500'],
            subtle: twColors.yellow['200'],
            dark: twColors.yellow['700']
          }
        }
      },
    },
  },
}

export default appTheme
