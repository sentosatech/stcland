import * as React from 'react'
import { appliedStyles, cns } from '@stcland/utils'

import { useTabsContext } from './context/TabsContext'

export interface TabProps {
    index: number;
    children: React.ReactNode;
    label: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: (index: number) => void;
    colorClass?: string
  }

//*****************************************************************************
// Components
//*****************************************************************************

const Tab = ({
  index,
  children,
  disabled = false,
  className,
  colorClass,
  onClick }: TabProps) => {
  const { activeTab, setActiveTab, customStyles } = useTabsContext()
  const isActive = activeTab === index

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(index)
      onClick?.(index)
    }
  }

  const tabDefaultStyles = {
    root: 'px-6 py-3',
    activeStyle: 'font-bold text-primary-surface-default',
    colorClass: 'bg-white text-neutral-text-icon-body',
    disabled: 'text-gray-500 bg-white cursor-not-allowed'
  }

  const mergedStyles = appliedStyles(tabDefaultStyles, customStyles?.tab)

  const cn = {
    root : cns(mergedStyles.root,
      colorClass ?? mergedStyles.colorClass,
      isActive && mergedStyles.activeStyle,
      disabled && mergedStyles.disabled, className)
  }

  return (
    <button
      role="tab"
      aria-disabled={disabled}
      aria-selected={isActive}
      disabled={disabled}
      onClick={handleClick}
      className={cn.root}
    >
      {children}
    </button>
  )
}

export default Tab