import * as React from 'react'
import { cns } from '@stcland/utils'

import { useTabsContext } from './context/TabsContext'

export interface TabProps {
    index: number;
    children: React.ReactNode;
    label: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: (index: number) => void;
    ref?: any
    colorClass?: string
  }

const Tab = ({
  index,
  children,
  disabled = false,
  className,
  colorClass,
  onClick }: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === index

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(index)
      onClick?.(index)
    }
  }

  const cn = {
    root : cns('px-6 py-3',isActive ? 'font-bold' : '', isActive && 'text-primary-main', className)
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