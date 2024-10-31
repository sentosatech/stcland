import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { appliedStyles, cns } from '@stcland/utils'

export interface AccordionDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionDetails = ({
  children,
  className = '',
  ...rest
}: AccordionDetailsProps) => {

  const { expanded, detailsId, customStyles } = useAccordionContext()

  if (!expanded) return null

  const accordionDetailsStyles = {
    root: cns( 'p-4 bg-gray-825 text-gray-400', className),
  }


  const cn = appliedStyles(accordionDetailsStyles, customStyles?.accordionDetails)

  return (
    <div
      id={detailsId}
      role='region'
      className={cn.root} {...rest}>
      {children}
    </div>
  )
}
