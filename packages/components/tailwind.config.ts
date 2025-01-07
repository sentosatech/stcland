import type { Config } from 'tailwindcss'
import * as d3 from 'd3-interpolate'
import twColors from 'tailwindcss/colors'
import { fontFamily } from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

type ShadeKey = 450 | 475 | 525 | 550 | 575 | 625 | 650 | 725 | 750 | 760 | 775 | 825 | 850 | 875;

/**
 Creates an extension of a given color palette by interpolating
 between adjacent shades.
 */
function createColorExtension(color: Record<string, string>): Record<ShadeKey, string> {
  return {
    450: d3.interpolate(color['400'], color['500'])(0.5),
    475: d3.interpolate(color['400'], color['500'])(0.75),
    525: d3.interpolate(color['500'], color['600'])(0.25),
    550: d3.interpolate(color['500'], color['600'])(0.5),
    575: d3.interpolate(color['500'], color['600'])(0.75),
    625: d3.interpolate(color['600'], color['700'])(0.25),
    650: d3.interpolate(color['600'], color['700'])(0.5),
    725: d3.interpolate(color['700'], color['800'])(0.25),
    750: d3.interpolate(color['700'], color['800'])(0.5),
    760: d3.interpolate(color['700'], color['800'])(0.6),
    775: d3.interpolate(color['700'], color['800'])(0.75),
    825: d3.interpolate(color['800'], color['900'])(0.25),
    850: d3.interpolate(color['800'], color['900'])(0.5),
    875: d3.interpolate(color['800'], color['900'])(0.75),
  }
}

// const primary = 'sky'
// const secondary = 'orange'

const appGray = twColors.zinc
const grayWithMoreShades = createColorExtension(appGray)

export const config : Config = {
  // Optimize CSS generation and compilation for faster build times.
  mode: 'jit',
  content: [
    '../../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    './src/**/*.(js|jsx|ts|tsx|mdx)'
  ],
  theme: {
    extend: {
      fontFamily: {
        ...fontFamily,
        'sans': ['Roboto', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      // Breakpoints for responsive views.
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        // Theme basic palette
        'primary': {
          // New STCDS
          surface: {
            default: twColors.indigo['800'],
            light: twColors.indigo['500'],
            subtle: twColors.indigo['500'],
            dark: twColors.indigo['950']
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

        // Using more shades of gray.
        'gray': { ...appGray, ...grayWithMoreShades },

        // New STCDS
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
            dark: twColors.gray['400']
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
            default: twColors.red['400'],
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
      opacity: {
        2: '.02',
        2.5: '.025',
        3: '.03',
        3.5: '.035',
        4: '.04',
        4.5: '.045',
      },
      spacing: {
        4.5: '1.15rem',
        30: '7.5rem',
      },
      minWidth: {
        20: '5rem',
        28: '7rem',
        30: '7.5rem',
        32: '8rem',
        46: '11.5rem',
        50: '12.5rem',
        68: '17rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      width: {
        20: '5rem',
        46: '11.5rem',
        50: '12.5rem',
        68: '17rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      height: {
        46: '11.5rem',
        50: '12.5rem',
        68: '17rem',
        112: '28rem',
        128: '32rem',
        132: '34rem',
        136: '35rem',
        144: '36rem',
        152: '38rem',
        160: '40rem',
      },
      minHeight: {
        46: '11.5rem',
        50: '12.5rem',
        68: '17rem',
        112: '28rem',
        128: '32rem',
        132: '34rem',
        136: '35rem',
        144: '36rem',
        152: '38rem',
        160: '40rem',
      },
      fontSize: {
        'sm+': ['0.9375rem', '1.4'],
        'xs+' : ['0.85rem', '1'],
        '1.5xs': ['0.7rem', '0.95rem'],
        '2xs': ['0.65rem', '0.9rem'],
        '2.5xs': ['0.575rem', '0.8rem'],
        '3xs': ['0.5rem', '0.7rem'],
        '4xs': ['0.42rem', '0.45rem'],
        '8px': ['8px', ''],
        '0.5sm': ['10px', ''],
      },
      borderWidth: {
        0.5: '0.5px',
        1.5: '1.5px'
      },
      scale: {
        175: '1.75',
        200: '2.00',
        250: '2.50',
        300: '3.00',
      },
    }
  },
  plugins: [typography],
}

export default config

