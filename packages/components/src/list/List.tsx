import React from 'react'
import ListContext from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'
import type { ListStyles } from 'src/styles'

export interface ListProps {
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
  disablePadding?: boolean;
  disableGutters?: boolean;
  subheader?: React.ReactNode;
  ordered?: boolean;
  customStyles?: Partial<ListStyles>
}

export const List = ({
  children,
  className = '',
  dense = false,
  disablePadding = false,
  disableGutters = false,
  subheader,
  ordered = false,
  customStyles
}: ListProps) => {

  const ListElement = ordered ? 'ol' : 'ul'

  const defaultStyles = {
    root: 'w-full max-w-lg bg-gray-825 text-gray-100 rounded-md shadow-md',
    dense: 'space-y-1',
    padding: 'p-4',
    gutters: 'px-4',
    ordered: 'list-decimal list-inside'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.list)

  const denseStyle = dense ? mergedStyles.dense : 'space-y-2'
  const paddingStyle = disablePadding ? 'p-0' : mergedStyles.padding
  const guttersClass = disableGutters ? '' : mergedStyles.gutters
  // TODO: troubleshoot style for ordered list
  const listTypeStyle = ordered ? mergedStyles.ordered : 'list-none'

  const cn = {
    root: cns(mergedStyles.root, denseStyle, paddingStyle, guttersClass, className, listTypeStyle)
  }

  return (
    <ListContext.Provider value={{ dense, disablePadding, disableGutters, subheader, customStyles }}>
      <ListElement className={cn.root}>
        {subheader}
        {children}
      </ListElement>
    </ListContext.Provider>
  )
}

export default List
