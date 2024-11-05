import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListSubheaderProps {
  children: React.ReactNode;
  className?: string;
  color?: 'secondary' | 'neutral' | 'primary';
  disableSticky?: boolean;
  inset?: boolean;
}

//*****************************************************************************
// Components
//*****************************************************************************

export const ListSubheader = ({
  children,
  className = '',
  color = 'primary',
  disableSticky = false,
  inset = false,
}: ListSubheaderProps) => {
  const { disableGutters, customStyles } = useListContext()

  const defaultStyles = {
    root: '',
    neutral: 'text-gray-700',
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    sticky: 'sticky top-0 z-10',
    inset: 'ml-4'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItemSubheader)

  const colorVariants = {
    [mergedStyles.neutral] : color === 'neutral',
    [mergedStyles.primary] : color === 'primary',
    [mergedStyles.secondary] : color === 'secondary',
  }

  const gutterClass = disableGutters ? 'py-0 px-0' : 'py-2 px-4'
  const stickyClass = disableSticky ? '' : mergedStyles.sticky
  const insetClass = inset ? mergedStyles.inset : ''

  const cn = {
    root: cns(mergedStyles.root, gutterClass, stickyClass, insetClass, colorVariants, className)
  }

  return (
    <div
      role="heading"
      className={cn.root}
    >
      {children}
    </div>
  )
}

export default ListSubheader
