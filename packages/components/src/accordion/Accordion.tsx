import * as React from 'react'
import { AccordionProvider } from './context/AccordionContext'
import { cns, appliedStyles } from '@stcland/utils'
import type { AccordionStyles } from '../styles/'

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  id: string;
  defaultExpanded?: boolean;
  className?: string;
  customStyles?: Partial<AccordionStyles>
}

export const Accordion = ({
  children,
  id,
  defaultExpanded = false,
  className = '',
  customStyles,
  ...rest
}: AccordionProps) => {
  const summaryId = `${id}-header`
  const detailsId = `${id}-content`

  const accordionStyles = {
    root: cns('border rounded bg-gray-825', className),
  }

  const cn  = appliedStyles( accordionStyles, customStyles?.accordion)


  return (
    <AccordionProvider summaryId={summaryId} detailsId={detailsId} customStyles={customStyles} defaultExpanded={defaultExpanded}>
      <div
        role='region'
        aria-labelledby={summaryId}
        className={cn.root}
        {...rest}>
        {children}
      </div>
    </AccordionProvider>
  )
}
