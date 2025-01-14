import * as React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { useAccordionContext } from './context/AccordionContext'
import { AccordionStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface AccordionActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Content displayed at the bottom of the accordion, expected to be actionable items
  disableSpacing?: boolean; // If `true`, removes the spacing between actions, defaults to `false`
  className?: string; // Additionl classes for styling
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

  const accordionActionStyles : AccordionStyles['accordionAction'] = {
    root: cns('flex justify-end gap-2', className),
    spacing: 'p-4'
  }

  const mergedStyles = appliedStyles<AccordionStyles['accordionAction']>(accordionActionStyles, customStyles?.accordionAction)

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
