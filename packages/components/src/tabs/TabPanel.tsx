import * as React from 'react'

export interface TabPanelProps {
    value: number;
    index: number;
    children: React.ReactNode;
    dir?: string;
  }

const TabPanel = ({ value, index, children, dir }: TabPanelProps) => {

  const cn = {
    root: 'text-white'
  }

  return (
    <div
      className={cn.root}
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`tab-${index}`}
      dir={dir}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

export default TabPanel