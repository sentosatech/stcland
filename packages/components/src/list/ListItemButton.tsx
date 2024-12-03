import React from 'react'
import { useListContext } from './context/ListContext'
import { appliedStyles, cns } from '@stcland/utils'
import { ListStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface ListItemButtonProps {
  children: React.ReactNode;
  onClick?: (param?: unknown) => void;
  alignItems?: 'center' | 'start'; // Defines alignment of the button content, defaults to `center`
  autoFocus?: boolean; // Focuses the button automatically when the component mounts, defaults to `false`
  className?: string; // Additional classes
  dense?: boolean; // Applies dense styles to the button, overrides context, defaults to `false`
  disabled?: boolean; // If `true`, disableds the button, and applies pseudo-classes, defaults to `false`
  divider?: boolean; // If `true`, adds a divider below the button, defaults to `false`
  selected?: boolean; // If `true`, styles the button as `selected`, defaults to `false`
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

  const defaultStyles: ListStyles['listItemButton'] = {
    root: 'w-full flex rounded',
    dense: 'py-1',
    divider: 'border-b border-primary-main',
    selected: 'bg-gray-600',
    hover: 'hover:bg-gray-700',
    disabled: 'disabled:bg-gray-750',
    disabledChilds: 'group disabled:text-gray-600'
  }

  const mergedStyles = appliedStyles<ListStyles['listItemButton']>(defaultStyles, customStyles?.listItemButton)

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
    // Adding a <li/> wrapper to keep semantics intact without affecting button accessibility.
    <li>
      <button
        autoFocus={autoFocus}
        onClick={onClick}
        disabled={disabled}
        className={cn.root}
      >
        {children}
      </button>
    </li>
  )
}

export default ListItemButton
