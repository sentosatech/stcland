import React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { useListContext } from './context/ListContext'

//*****************************************************************************
// Interface
//*****************************************************************************

// Base props, shared by both variants
interface BaseListItemTextProps {
  alignItem?: 'center' | 'left'; // Defines alignment of the list item text contents, defaults to `center`
  className?: string; // Additional classes applied to the root.
  inset?: boolean; // If `true` applies left padding, defaults to `false`
}

// Allows `primaryText` and `secondaryText`, but not `children`
interface WithPrimarySecondary extends BaseListItemTextProps {
  primaryText?: string; // Text that will be rendered as the primary variant
  secondaryText?: string; // Text that will be rendered as the secondary variant
  children?: never;
}

// Allows `children`, but not `primaryText` or `secondaryText`
interface WithChildren extends BaseListItemTextProps {
  children: React.ReactNode; // Single element passed if wanted to render a more fancy content.
  primaryText?: never;
  secondaryText?: never;
}

// Combined type, ensuring mutual exclusivity
export type ListItemTextProps = WithPrimarySecondary | WithChildren;

//*****************************************************************************
// Components
//*****************************************************************************

export const ListItemText = ({
  alignItem = 'left',
  children,
  className = '',
  inset = false,
  primaryText,
  secondaryText,
}: ListItemTextProps) => {
  const { customStyles } = useListContext()

  const defaultStyles = {
    root: 'flex flex-col w-full',
    inset: 'pl-8',
    disabledByParent: 'group-disabled:text-gray-500',
    primaryText: 'text-base font-medium text-gray-200',
    secondaryText: 'text-sm text-gray-400'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItemText)

  const insetStyle = inset ? mergedStyles.inset : ''
  const alignItemStyle = `text-${alignItem}`

  const cn = {
    root: cns(mergedStyles.root, insetStyle, className, mergedStyles.disabledByParent),
    primaryText: cns(mergedStyles.primaryText, alignItemStyle, mergedStyles.disabledByParent),
    secondaryText: cns(mergedStyles.secondaryText, alignItemStyle, mergedStyles.disabledByParent),
  }

  const primaryContent = primaryText && (
    <span className={cn.primaryText}>
      {primaryText}
    </span>
  )

  const secondaryContent = secondaryText && (
    <span className={cn.secondaryText}>
      {secondaryText}
    </span>
  )

  return (
    <div className={cn.root}>
      {children || (
        <>
          {primaryContent}
          {secondaryContent}
        </>
      )}
    </div>
  )
}

export default ListItemText
