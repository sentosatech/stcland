import * as React from 'react'
import { useAccordionContext } from './context/AccordionContext'
import { cns, appliedStyles } from '@stcland/utils'
import { AccordionStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

interface AccordionSummaryBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Content rendered as the `header` of the accordion section
  className?: string; // Additional classes for styling applied to the `root`
}

// Make sure that only if `expandedIcon` is present, `onlyIconClickable` can be used.
export type AccordionSummaryProps =
  | (AccordionSummaryBaseProps & { expandIcon?: never; onlyIconClickable?: never })
  | (AccordionSummaryBaseProps & { expandIcon: React.ReactNode; onlyIconClickable?: boolean });

//*****************************************************************************
// Components
//*****************************************************************************

export const AccordionSummary = ({
  children,
  expandIcon,
  className = '',
  onlyIconClickable = false,
  ...rest
}: AccordionSummaryProps) => {
  const { expanded, toggle, summaryId, detailsId, customStyles } = useAccordionContext()


  const accordionSummaryStyles : AccordionStyles['accordionSummary'] = {
    root: cns('flex justify-between items-center p-4 bg-gray-825 text-gray-100 border-b border-primary-main', className),
    icon: 'ml-2 transition-transform duration-300 ease-in-out'
  }

  const mergedStyles = appliedStyles<AccordionStyles['accordionSummary']>(accordionSummaryStyles, customStyles?.accordionSummary)

  const cn = {
    root: cns(mergedStyles.root),
    icon: cns(mergedStyles.icon, expanded ? 'rotate-180' : 'rotate-0', onlyIconClickable && 'cursor-pointer')
  }

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onlyIconClickable) {
      e.stopPropagation()
    }
    toggle()
  }

  return (
    <div
      id={summaryId}
      role={!onlyIconClickable ? 'button' : 'presentation'}
      aria-expanded={expanded}
      aria-controls={detailsId}
      {...(!onlyIconClickable ? { onClick: toggle } : {})}
      className={cn.root}
      {...rest}
    >
      <div>{children}</div>
      <div className={cn.icon}
        {...(onlyIconClickable ? { onClick: handleToggle } : {})}
      >{expandIcon}</div>
    </div>
  )
}
