import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { cns, appliedStyles } from '@stcland/utils'
import { AccordionStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface AccordionSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Content rendered as the `header` of the accordion section
  expandIcon?: React.ReactNode; // Icon displayed to indicate `expand/collapse` state
  className?: string; // Additonal classes for styling applied to the `root`
}

//*****************************************************************************
// Components
//*****************************************************************************

export const AccordionSummary = ({
  children,
  expandIcon,
  className = '',
  ...rest
}: AccordionSummaryProps) => {
  const { expanded, toggle, summaryId, detailsId, customStyles } = useAccordionContext()

  const accordionSummaryStyles : AccordionStyles['accordionSummary'] = {
    root: cns('flex justify-between items-center p-4 cursor-pointer bg-gray-825 text-gray-100 border-b border-primary-main', className),
    icon: 'ml-2 transition-transform duration-300 ease-in-out'
  }

  const mergedStyles = appliedStyles<AccordionStyles['accordionSummary']>(accordionSummaryStyles, customStyles?.accordionSummary)

  const cn = {
    root: mergedStyles.root,
    icon: cns(mergedStyles.icon, expanded ? 'rotate-180' : 'rotate-0')
  }

  return (
    <div
      id={summaryId}
      role="button"
      aria-expanded={expanded}
      aria-controls={detailsId}
      onClick={toggle}
      className={cn.root}
      {...rest}
    >
      <div>{children}</div>
      <div className={cn.icon}>{expandIcon}</div>
    </div>
  )
}
