import React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { useListContext } from './context/ListContext'

export interface ListItemTextProps {
  alignItem?: 'center' | 'left';
  children?: React.ReactNode;
  className?: string;
  inset?: boolean;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
}

export const ListItemText = ({
  alignItem ='left',
  children,
  className = '',
  inset = false,
  primary,
  secondary,
}: ListItemTextProps) => {
  const { customStyles } = useListContext()

  const defaultStyles = {
    root: 'flex flex-col w-full',
    inset: 'pl-8',
    disabledByParent: 'text-gray-500',
    primaryContent: 'text-base font-medium text-gray-200',
    secondaryContent: 'text-sm text-gray-400'
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles?.listItemText)

  const insetStyle = inset ? mergedStyles.inset : ''
  const contentDisabledByParentStyle = `group-disabled:${mergedStyles.disabledByParent}`
  const alignItemStyle = `text-${alignItem}`

  const cn = {
    root: cns(mergedStyles.root, insetStyle, className, contentDisabledByParentStyle),
    primaryContent: cns(mergedStyles.primaryContent, alignItemStyle),
    secondaryContent: cns(mergedStyles.secondaryContent, alignItemStyle),
  }
  const primaryContent = primary &&
    <span className={cn.primaryContent}>
      {primary}
    </span>

  const secondaryContent = secondary &&
    <span className={cn.secondaryContent}>
      {secondary}
    </span>

  return (
    <div
      className={cn.root}
    >
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
