import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { cns } from '@stcland/utils'

export interface AccordionSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  expandIcon?: React.ReactNode;
  className?: string;
}

export const AccordionSummary = ({
  children,
  expandIcon,
  className = '',
  ...rest
}: AccordionSummaryProps) => {
  const { expanded, toggle, summaryId, detailsId } = useAccordionContext()

  const accordionSummaryStyles = {
    root: cns( 'flex justify-between items-center p-4 cursor-pointer bg-gray-825 text-gray-100', className),
    icon: cns(
      'ml-2 transition-transform duration-300 ease-in-out',
      expanded ? 'rotate-180' : 'rotate-0'
    )
  }

  return (
    <div
      id={summaryId}
      role="button"
      aria-expanded={expanded}
      aria-controls={detailsId}
      onClick={toggle}
      className={accordionSummaryStyles.root}
      {...rest}
    >
      <div>{children}</div>
      <div className={accordionSummaryStyles.icon}>{expandIcon}</div>
    </div>
  )
}
