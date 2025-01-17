import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { appliedStyles, cns } from '@stcland/utils'
import { AccordionStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface AccordionDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Content rendered when `expanded` property is `true`
  className?: string; // Additional classes for styling
}

//*****************************************************************************
// Components
//*****************************************************************************

export const AccordionDetails = ({
  children,
  className = '',
  ...rest
}: AccordionDetailsProps) => {

  const { expanded, detailsId, customStyles } = useAccordionContext()

  const accordionDetailsStyles : AccordionStyles['accordionDetails'] = {
    root: 'bg-gray-825 text-gray-400 transition-all duration-500 ease-in-out overflow-hidden',
  }

  const mergedStyles = appliedStyles<AccordionStyles['accordionDetails']>(accordionDetailsStyles, customStyles?.accordionDetails)

  const cn = {
    root: cns(mergedStyles.root, className, expanded ? 'opacity-100 p-4 max-h-full' : 'opacity-0 p-0 max-h-0 delay-300')
  }

  return (
    <div
      id={detailsId}
      role='region'
      className={cn.root} {...rest}>
      {children}
    </div>
  )
}
