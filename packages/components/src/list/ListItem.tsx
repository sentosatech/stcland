import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListItemProps {
  alignItems?: 'center' | 'start';
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

//*****************************************************************************
// Components
//*****************************************************************************

export const ListItem = ({
  alignItems = 'center',
  children,
  className = '',
  divider = false,
}: ListItemProps) => {
  const { dense, disablePadding, customStyles } = useListContext()

  const defaultStyles = {
    root: 'flex',
    padding: 'p-4',
    divider: 'border-b border-primary-main',
    dense: 'py-1',
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItem)

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
