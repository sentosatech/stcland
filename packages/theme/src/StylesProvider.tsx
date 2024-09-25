import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import './global.css'
import { config } from '../tailwind.config'

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
  styles?: {
    table?: Partial<TableStyles>
  }
}

const defaultStyles : StclandStyles = {
  styles: {
    table: { root: 'border border-gray-825 bg-gray-825 px-4 pt-8 pb-14',
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
}

const StylesContext = createContext<StclandStyles>(defaultStyles)

export const StcStylesProvider = ({ children, customStyles }:
  { children: ReactNode, customStyles?: StclandStyles}) => {

  const styles = customStyles ?? defaultStyles

  return (
    <StylesContext.Provider value={styles}>
      {children}
    </StylesContext.Provider>
  )
}

export const useStyles = (): StclandStyles => {
  return useContext(StylesContext)
}


export { config as themeConfig }