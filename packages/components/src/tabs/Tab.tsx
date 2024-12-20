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
    activeStyle: 'font-bold',
    colorClass: 'bg-gray-800 text-primary-main',
    disabled: 'bg-gray-400'
  }

  const mergedStyles = appliedStyles(tabDefaultStyles, customStyles?.tab)

  const cn = {
    root : cns(mergedStyles.root,isActive &&
        mergedStyles.activeStyle,
    colorClass ?? mergedStyles.colorClass,
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