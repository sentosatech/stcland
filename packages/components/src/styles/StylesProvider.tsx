import * as React from 'react'
import { appliedStyles } from '@stcland/utils'
import { defaultStyles } from './defaults'
import type { StclandStyles } from './defaults'

export type StylesContextType = {
  styles: StclandStyles | null
}

const StylesContext = React.createContext<StylesContextType | null>(null)

export const StcStylesProvider = ({ children, customStyles }:
  { children: React.ReactNode, customStyles?: StclandStyles }) => {
  const [styles, setStyles] = React.useState<StclandStyles>(defaultStyles)

  React.useEffect(() => {
    const mergedStyles = appliedStyles(defaultStyles, customStyles || {})
    setStyles(mergedStyles)
  }, [customStyles])

  return (
    <StylesContext.Provider value={{ styles }}>
      {children}
    </StylesContext.Provider>
  )
}

export const useStyles = (): StylesContextType => {
  const context = React.useContext(StylesContext)

  if (!context) {
    throw new Error('useStyles must be used within a StcStylesProvider')
  }

  return context
}

export const getStyles = (customStyles?: StclandStyles) => {
  return appliedStyles(defaultStyles, customStyles || {})
}
