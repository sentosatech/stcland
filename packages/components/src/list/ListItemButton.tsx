import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'

export interface ListItemButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  alignItems?: 'center' | 'start';
  autoFocus?: boolean;
  className?: string;
  dense?: boolean;
  disabled?: boolean;
  divider?: boolean;
  selected?: boolean;
}

export const ListItemButton = ({
  alignItems = 'start',
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
    divider: 'border-b border-gray-200',
    selected: 'bg-gray-200',
    hover: 'bg-gray-700',
    disabled: 'bg-gray-750',
    disabledChilds: 'text-gray-600'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItemButton)

  const isDense = dense ?? denseFromParent

  const alignmentClass = `items-${alignItems}`
  const denseClass = isDense ? mergedStyles.dense : 'py-2'
  const guttersClass = disableGutters ? 'px-0' : 'px-4'
  const dividerClass = divider ? mergedStyles.divider : ''
  const selectedClass = selected ? mergedStyles.selected : ''
  const hoverStyle = `hover:${mergedStyles.hover}`
  const disabledStyle = disabled ? `disabled:${mergedStyles.disabled} group disabled:${mergedStyles.disabledChilds}` : ''

  const cn = {
    root: cns(mergedStyles.root, alignItems, denseClass, alignmentClass, guttersClass, dividerClass, selectedClass, className, hoverStyle, disabledStyle),
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
