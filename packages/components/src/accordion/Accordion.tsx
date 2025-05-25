import * as React from 'react'
import { AccordionProvider } from './context/AccordionContext'
import { cns, appliedStyles } from '@stcland/utils'
import type { AccordionStyles } from '../styles/'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Content to be rendered inside the accordion
  id: string; // Unique identifier
  defaultExpanded?: boolean; // If `true`, is expanded by default, this property state will applied to child elements, defaults to false.
  className?: string; // Additional classes applied to the root.
  customStyles?: Partial<AccordionStyles> // Additional specific classes per `AccordionStyles` type.
}

//*****************************************************************************
// Components
//*****************************************************************************

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

  const accordionStyles : AccordionStyles['accordion'] = {
    root: cns('bg-gray-825', className),
  }

  const cn  = appliedStyles<AccordionStyles['accordion']>( accordionStyles, customStyles?.accordion)


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
