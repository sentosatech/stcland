import * as React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { TabsStyles } from 'src/styles'

export interface TabPanelProps {
    value: number;
    index: number;
    children: React.ReactNode;
    className?: string
    colorClass?: string
    customStyles?: Partial<TabsStyles['tabPanel']>
  }


//*****************************************************************************
// Components
//*****************************************************************************

const TabPanel = ({ value, index, children, className, colorClass, customStyles }: TabPanelProps) => {

  const defaultTabPanelStyles = {
    root: 'p-4',
    colorClass: 'bg-white text-primary-surface-default'
  }

  const mergedStyles = appliedStyles(defaultTabPanelStyles, customStyles)

  const cn = {
    root: cns(mergedStyles.root, colorClass ?? mergedStyles.colorClass, className)
  }

  return (
    <div
      className={cn.root}
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

export default TabPanel