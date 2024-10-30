import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { cns } from '@stcland/utils'

export interface AccordionDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionDetails = ({
  children,
  className = '',
  ...rest
}: AccordionDetailsProps) => {

  const accordionDetailsStyles = {
    root: cns( 'p-4 bg-gray-825 text-gray-400', className),
  }

  const { expanded, detailsId } = useAccordionContext()

  if (!expanded) return null

  return (
    <div
      id={detailsId}
      role='region'
      className={accordionDetailsStyles.root} {...rest}>
      {children}
    </div>
  )
}
