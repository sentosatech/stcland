import * as React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { TooltipStyles } from 'src/styles'
import useOutsideClick from '../utils'

//*****************************************************************************
// Interface
//*****************************************************************************

// TODO: extend correctly with other granular placements.
type Placement =
  | 'top'
  // | 'topLeft'
  // | 'topRight'
  | 'bottom'
  // | 'bottomLeft'
  // | 'bottomRight'
  | 'left'
  // | 'leftTop'
  // | 'leftBottom'
  | 'right'
  // | 'rightTop'
  // | 'rightBottom'

type Trigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export interface TooltipProps {
  children: React.ReactNode
  title: React.ReactNode | (() => React.ReactNode);
  arrow?: boolean | { pointAtCenter: boolean };
  colorClass?: string;
  defaultOpen?: boolean;
  destroyTooltipOnHide?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  placement?: Placement;
  trigger?: Trigger | Trigger[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  customStyles?: Partial<TooltipStyles>
}


//*****************************************************************************
// Components
//*****************************************************************************

const Tooltip = ({
  title,
  arrow = true,
  colorClass,
  defaultOpen = false,
  destroyTooltipOnHide = false,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  placement = 'top',
  trigger = 'hover',
  open: controlledOpen,
  onOpenChange,
  children,
  customStyles
}: TooltipProps) => {
  const [visible, setVisible] = React.useState(defaultOpen)
  const tooltipRef = React.useRef<HTMLDivElement | null>(null)
  const isControlled = controlledOpen !== undefined

  const showTooltip = () => {
    if (!isControlled) setVisible(true)
    onOpenChange?.(true)
  }

  const hideTooltip = () => {
    if (!isControlled) setVisible(false)
    onOpenChange?.(false)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (trigger === 'hover' || (Array.isArray(trigger) && trigger.includes('hover'))) {
      setTimeout(() => showTooltip(), mouseEnterDelay * 1000)
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (trigger === 'hover' || (Array.isArray(trigger) && trigger.includes('hover'))) {
      setTimeout(() => hideTooltip(), mouseLeaveDelay * 1000)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click' || (Array.isArray(trigger) && trigger.includes('click'))) {
      if (visible){
        hideTooltip()
      } else {
        showTooltip()
      }
    }
  }

  useOutsideClick(tooltipRef, {
    onClickOutside: hideTooltip,
    capture: false,
  })

  const getTooltipPosition = () => {
    switch (placement) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2'
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2'
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2'
    default:
      return 'top-full left-1/2 transform -translate-x-1/2'
    }
  }

  const getArrowPosition = () => {
    switch (placement) {
    case 'top':
      return 'bottom-[-9px] left-1/2 transform -translate-x-1/2 rotate-180'
    case 'bottom':
      return 'top-[-9px] left-1/2 transform -translate-x-1/2 rotate-0'
    case 'left':
      return 'right-[-11px] top-1/2 transform -translate-y-1/2 rotate-90'
    case 'right':
      return 'left-[-11px] top-1/2 transform -translate-y-1/2 -rotate-90'
    default:
      return 'bottom-[-9px] left-1/2 transform -translate-x-1/2 rotate-180'
    }
  }

  // Margin between tooltip and children.
  const getMarginStyle = () => {
    switch (placement) {
    case 'top':
      return 'mb-3'
    case 'bottom':
      return 'mt-3'
    case 'left':
      return 'mr-3'
    case 'right':
      return 'ml-3'
    default:
      return 'mb-3'
    }
  }

  const tooltipStyles : TooltipStyles = {
    root: 'relative inline-block',
    tooltipContainer: 'absolute z-50 p-3 rounded-md shadow-md text-sm w-max',
    colorClass: 'bg-zinc-600 text-white',
    arrow: 'absolute w-3.5 h-2.5 border-t-2 border-r-2 border-transparent',
    arrowColor: 'bg-zinc-600',
  }

  const mergedStyles = appliedStyles<TooltipStyles>(tooltipStyles, customStyles)

  const cn = {
    root: mergedStyles.root,
    tooltipContainer: cns(mergedStyles.tooltipContainer, colorClass ? colorClass : mergedStyles.colorClass),
    arrow: cns('tooltip-arrow', mergedStyles.arrow, colorClass ? colorClass : mergedStyles.arrowColor)
  }


  return (
    <div
      className={cn.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {(visible || controlledOpen || (!destroyTooltipOnHide && defaultOpen)) && (
        <div
          ref={tooltipRef}
          className={cns(cn.tooltipContainer, getMarginStyle(), getTooltipPosition())}
        >
          <div>
            {typeof title === 'function' ? title() : title}
          </div>
          {arrow && <div className={cns(cn.arrow, getArrowPosition())}></div>}
        </div>
      )}
    </div>
  )
}

export default Tooltip