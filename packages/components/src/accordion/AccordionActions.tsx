import * as React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { useAccordionContext } from './context/AccordionContext'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface AccordionActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disableSpacing?: boolean;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************

export const AccordionActions = ({
  children,
  disableSpacing = false,
  className = '',
  ...rest
}: AccordionActionsProps) => {
  const { expanded, customStyles } = useAccordionContext()

  if (!expanded) return null

  const accordionActionStyles = {
    root: cns('flex justify-end gap-2', className),
    spacing: 'p-4'
  }

  const mergedStyles = appliedStyles(accordionActionStyles, customStyles?.accordionAction)

  const cn = {
    root: cns(mergedStyles.root, disableSpacing ? '' :  mergedStyles.spacing)
  }

  return (
    <div
      className={cn.root}
      {...rest}
    >
      {children}
    </div>
  )
}
