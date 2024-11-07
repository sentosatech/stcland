import React from 'react'
import ListContext from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'
import type { ListStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListProps {
  children: React.ReactNode; // The list items rendered within the list, always a <li/> component
  className?: string; // Additionl classes for styling applied to the `root`
  dense?: boolean; // If `true` reduces the padding between list items, defaults to `false`
  disablePadding?: boolean; // if `true` removes padding for the list, defaults to `false`
  disableGutters?: boolean; // if `true` removes horizontal padding from list items, defaults to `false`
  subheader?: React.ReactNode | string; // A subheader element or string rendered above the list
  ordered?: boolean; // if `true` renders an ordered list `<ol/>`, otherwise an unordered list `<ul/>`, defaults to false.
  divider?: boolean; // If `true` adds a divider line below the list, defaults to `false`, mostly used when there are nested lists.
  customStyles?: Partial<ListStyles> // Additional specific classes per `ListStyles` type.
}

//*****************************************************************************
// Components
//*****************************************************************************

export const List = ({
  children,
  className = '',
  dense = false,
  disablePadding = false,
  disableGutters = false,
  subheader,
  ordered = false,
  divider = false,
  customStyles
}: ListProps) => {

  const ListElement = ordered ? 'ol' : 'ul'

  const defaultStyles: ListStyles['list'] = {
    root: 'w-full max-w-lg bg-gray-825 text-gray-100 rounded-md shadow-md',
    dense: 'space-y-1',
    padding: 'p-4',
    gutters: 'px-4',
    ordered: 'list-decimal list-inside',
    divider: 'border-b border-primary-main',
    subheader: 'px-4 text-primary-main'
  }

  const mergedStyles = appliedStyles<ListStyles['list']>(defaultStyles, customStyles?.list)

  const denseStyle = dense ? mergedStyles.dense : 'space-y-2'
  const paddingStyle = disablePadding ? 'p-0' : mergedStyles.padding
  const guttersStyle = disableGutters ? '' : mergedStyles.gutters
  const dividerStyle = divider ? mergedStyles.divider : ''
  // TODO: troubleshoot style for ordered list
  const listTypeStyle = ordered ? mergedStyles.ordered : 'list-none'

  const cn = {
    root: cns(mergedStyles.root, denseStyle, paddingStyle, guttersStyle, dividerStyle, className, listTypeStyle),
    subheader: mergedStyles.subheader
  }

  return (
    <ListContext.Provider value={{ dense, disablePadding, disableGutters, subheader, customStyles }}>
      <ListElement className={cn.root}>
        {subheader &&  <div role='heading' className={cn.subheader}>{subheader}</div>}
        {children}
      </ListElement>
    </ListContext.Provider>
  )
}

export default List
