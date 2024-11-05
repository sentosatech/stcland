import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'

export interface ListItemProps {
  alignItems?: 'center' | 'start';
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  secondaryAction?: React.ReactNode;
}

export const ListItem = ({
  alignItems = 'center',
  children,
  className = '',
  divider = false,
  secondaryAction,
}: ListItemProps) => {
  const { dense, disablePadding, customStyles } = useListContext()

  const defaultStyles = {
    root: '',
    padding: 'p-4',
    divider: 'border-b border-primary-main',
    listItem: '',
    dense: 'py-1',
    secondaryAction: 'ml-auto'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItem)

  const alignmentClass = `items-${alignItems}`
  const denseClass = dense ? mergedStyles.dense : 'py-2'
  const paddingStyle = disablePadding ? 'p-0' : mergedStyles.padding
  const dividerClass = divider ? mergedStyles.divider : ''

  const cn = {
    root: cns(alignmentClass, denseClass, dividerClass, paddingStyle, className),
    listItem: mergedStyles.listItem,
    secondaryAction: mergedStyles.secondaryAction
  }

  return (
    <li
      className={cn.root}
    >
      <div className={cn.listItem}>{children}</div>
      {secondaryAction && <div className={cn.secondaryAction}>{secondaryAction}</div>}
    </li>
  )
}

export default ListItem
