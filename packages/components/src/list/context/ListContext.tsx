import * as React from 'react'
import type { ListStyles } from 'src/styles'

export interface ListContextProps {
  dense?: boolean;
  disablePadding?: boolean;
  disableGutters?: boolean;
  subheader?: React.ReactNode;
  customStyles?: Partial<ListStyles>
}

const ListContext = React.createContext<ListContextProps | null>(null)

export const useListContext = () => {
  const context = React.useContext(ListContext)
  if (!context) {
    throw new Error('List components must be used within a <List>.')
  }
  return context
}

export default ListContext
