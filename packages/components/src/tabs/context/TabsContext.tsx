import * as React from 'react'
import { TabsStyles } from 'src/styles'

interface TabsContextValue {
  activeTab: number;
  setActiveTab: (index: number) => void;
  customStyles?: Partial<TabsStyles>
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export const useTabsContext = (): TabsContextValue => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }
  return context
}