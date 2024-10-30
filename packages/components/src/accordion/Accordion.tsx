import * as React from 'react'
import { AccordionProvider } from './context/AccordionContext'
import { cns } from '@stcland/utils'

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  id: string;
  defaultExpanded?: boolean;
  className?: string;
}

export const Accordion = ({
  children,
  id,
  defaultExpanded = false,
  className = '',
  ...rest
}: AccordionProps) => {
  const summaryId = `${id}-header`
  const detailsId = `${id}-content`

  const accordionStyles = {
    root: cns('border rounded bg-gray-825', className),
  }

  return (
    <AccordionProvider summaryId={summaryId} detailsId={detailsId} defaultExpanded={defaultExpanded}>
      <div
        role='region'
        aria-labelledby={summaryId}
        className={accordionStyles.root}
        {...rest}>
        {children}
      </div>
    </AccordionProvider>
  )
}
