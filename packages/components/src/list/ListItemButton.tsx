import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListItemButtonProps {
  children: React.ReactNode;
  onClick?: (param?: unknown) => void;
  alignItems?: 'center' | 'start';
  autoFocus?: boolean;
  className?: string;
  dense?: boolean;
  disabled?: boolean;
  divider?: boolean;
  selected?: boolean;
}

//*****************************************************************************
// Components
//*****************************************************************************

export const ListItemButton = ({
  alignItems = 'center',
  onClick = () => {},
  autoFocus = false,
  children,
  className = '',
  dense,
  disabled = false,
  divider = false,
  selected = false,
}: ListItemButtonProps) => {

  const { customStyles, dense: denseFromParent, disableGutters } = useListContext()

  const defaultStyles = {
    root: 'w-full flex rounded',
    dense: 'py-1',
    divider: 'border-b border-primary-main',
    selected: 'bg-gray-600',
    hover: 'hover:bg-gray-700',
    disabled: 'disabled:bg-gray-750',
    disabledChilds: 'group disabled:text-gray-600'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItemButton)

  const isDense = dense ?? denseFromParent

  const alignmentClass = `items-${alignItems}`
  const denseClass = isDense ? mergedStyles.dense : 'py-2'
  const guttersClass = disableGutters ? 'px-0' : 'px-4'
  const dividerClass = divider ? mergedStyles.divider : ''
  const selectedClass = selected ? mergedStyles.selected : ''
  const disabledStyle = disabled ? `${mergedStyles.disabled} ${mergedStyles.disabledChilds}` : ''

  const cn = {
    root: cns(mergedStyles.root, alignItems, denseClass, alignmentClass, guttersClass, dividerClass, selectedClass, className, mergedStyles.hover, disabledStyle),
  }

  return (
    <button
      autoFocus={autoFocus}
      onClick={onClick}
      disabled={disabled}
      className={cn.root}
    >
      {children}
    </button>
  )
}

export default ListItemButton
