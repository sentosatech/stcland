import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { config } from '../../tailwind.config'
import { mergeCustomStyles } from '@stcland/utils'

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

export type StclandStyles = {
  table?: Partial<TableStyles>
}

export type StylesContextType = {
  styles: StclandStyles | null
  loading: boolean
}

// Default styles
const defaultStyles: StclandStyles = {
  table: {
    root: 'border border-gray-825 bg-gray-825 px-4 pt-8 pb-14',
    table: 'table-fixed',
    header: 'text-s text-gray-100 text-left',
    headerRow: '',
    headerCell: 'font-medium pl-6 pb-4',
    body: 'text-s text-gray-400',
    row: 'border-t last:border-b border-primary-dark',
    cell: 'px-6 py-6',
    selectedRow: 'bg-gray-500',
    subRow: 'text-secondary-main border-none'
  }
}

const StylesContext = createContext<StylesContextType | null>(null)
export const StcStylesProvider = ({ children, customStyles }: { children: ReactNode, customStyles?: StclandStyles }) => {
  const [styles, setStyles] = useState<StclandStyles>(defaultStyles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mergedStyles = {
      table: mergeCustomStyles(defaultStyles.table || {}, customStyles?.table || {})
    }
    console.log('MERGED STYLES:', mergedStyles)
    setStyles(mergedStyles)
    setLoading(false) // Styles have been loaded
  }, [customStyles])

  return (
    <StylesContext.Provider value={{ styles, loading }}>
      {children}
    </StylesContext.Provider>
  )
}

export const useStyles = (): StylesContextType => {
  const context = useContext(StylesContext)

  if (!context) {
    throw new Error('useStyles must be used within a StcStylesProvider')
  }

  return context
}

export const getStyles = (customStyles?: StclandStyles) => {
  return {
    ...defaultStyles,
    table: mergeCustomStyles(defaultStyles.table || {}, customStyles?.table),
  }
}

export { config as themeConfig }
