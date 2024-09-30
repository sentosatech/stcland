import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TableStyles } from './'
import { mergeCustomStyles } from '@stcland/utils'
import { defaultStyles } from './defaults'

export type StclandStyles = {
  table?: Partial<TableStyles>
}

export type StylesContextType = {
  styles: StclandStyles | null
}


const StylesContext = createContext<StylesContextType | null>(null)
export const StcStylesProvider = ({ children, customStyles }: { children: ReactNode, customStyles?: StclandStyles }) => {
  const [styles, setStyles] = useState<StclandStyles>(defaultStyles)

  useEffect(() => {
    const mergedStyles = {
      table: mergeCustomStyles(defaultStyles.table || {}, customStyles?.table || {})
    }
    setStyles(mergedStyles)
  }, [customStyles])

  return (
    <StylesContext.Provider value={{ styles }}>
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
