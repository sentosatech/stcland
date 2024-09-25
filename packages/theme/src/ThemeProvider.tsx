import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import './global.css'
import { config } from '../tailwind.config'
import type { Config } from 'tailwindcss'

export type TableStyles = {
  root: string
  table: string
  header: string
  headerRow: string
  headerCell: string
  body: string
  cell: string
  row: string
  selectedRow: string
  subRow: string
}

export type StclandTheme = Config['theme'] & {
  tableStyles?: TableStyles
}


const defaultTheme : StclandTheme = {
  ...config.theme,
}

const ThemeContext = createContext<StclandTheme>(defaultTheme)

export const ThemeProvider = ({ children, customTheme }: { children: ReactNode, customTheme?: StclandTheme }) => {
  return (
    <ThemeContext.Provider value={customTheme ?? defaultTheme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): StclandTheme => {
  return useContext(ThemeContext)
}


export { config as themeConfig }