import * as React from 'react'
import { cns } from '@stcland/utils'
import { useAccordionContext } from './context/AccordionContext'

export interface AccordionActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disableSpacing?: boolean;
  className?: string;
}

export const AccordionActions = ({
  children,
  disableSpacing = false,
  className = '',
  ...rest
}: AccordionActionsProps) => {
  const { expanded } = useAccordionContext()

  if (!expanded) return null

  const accordionActionStyles = {
    root: cns(`flex justify-end gap-2 ${
      disableSpacing ? '' : 'p-4'
    }`, className),
  }

  return (
    <div
      className={accordionActionStyles.root}
      {...rest}
    >
      {children}
    </div>
  )
}
