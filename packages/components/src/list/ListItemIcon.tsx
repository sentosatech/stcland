import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListItemIconProps {
  children: React.ReactNode;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************

export const ListItemIcon = ({ children, className = '' }: ListItemIconProps) => {
  const { customStyles } = useListContext()

  const defaultStyles = {
    root: className
  }

  const cn = appliedStyles(defaultStyles, customStyles?.listItemIcon)

  return (
    <div className={cn.root}>
      {children}
    </div>
  )
}

export default ListItemIcon
