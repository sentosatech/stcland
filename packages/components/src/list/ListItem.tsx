import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'
import { ListStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListItemProps {
  alignItems?: 'center' | 'start'; // Defines alignment of the list content, defaults to `center`
  children: React.ReactNode; // The content of the list item.
  className?: string; // Additional classes applied to the root.
  divider?: boolean; // If `true` adds a divider line below the list item, defaults to `false`.
}

//*****************************************************************************
// Components
//*****************************************************************************

export const ListItem = ({
  children,
  alignItems = 'center',
  className = '',
  divider = false,
}: ListItemProps) => {
  const { dense, disablePadding, customStyles } = useListContext()

  const defaultStyles: ListStyles['listItem'] = {
    root: 'flex',
    padding: 'p-4',
    divider: 'border-b border-primary-main',
    dense: 'py-1',
  }

  const mergedStyles = appliedStyles<ListStyles['listItem']>(defaultStyles, customStyles?.listItem)

  const alignmentClass = `items-${alignItems}`
  const denseClass = dense ? mergedStyles.dense : 'py-2'
  const paddingStyle = disablePadding ? 'p-0' : mergedStyles.padding
  const dividerClass = divider ? mergedStyles.divider : ''

  const cn = {
    root: cns(mergedStyles.root, alignmentClass, denseClass, dividerClass, paddingStyle, className),
  }

  return (
    <li
      className={cn.root}
    >
      {children}
    </li>
  )
}

export default ListItem
