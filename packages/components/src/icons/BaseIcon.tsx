
import { cns, appliedStyles } from '@stcland/utils'
import type { IconProps } from '.'
import { IconStyles } from 'src/styles/componentTypes'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface Props extends IconProps {
  SolidIcon: React.ComponentType<any>
  OutlineIcon: React.ComponentType<any>
}


//*****************************************************************************
// Components
//*****************************************************************************

export const BaseIcon : React.FC<Props>  = ({
  SolidIcon,
  OutlineIcon,
  sm, md, lg,
  solid = false,
  secondaryColor = false,
  highlightOnHover = false,
  brightenOnHover = false,
  muted = false,
  bright = false,
  onClick = () => {},
  customStyles,
  className
}
: Props ) => {

  const defaultStyles : IconStyles = {
    root: 'p-2',
    secondary: 'text-secondary-main',
    primary: 'text-primary-main',
    neutral: 'text-gray-600',
    sm: 'h-4.5 w-4.5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    rounded: 'rounded-md',
    bright: 'brightness-125',
    highlightOnHover: 'hover:bg-gray-600',
    brightenOnHover: 'hover:brightness-125',
    muted: 'opacity-50'
  }

  const mergedStyles = appliedStyles<IconStyles>(defaultStyles, customStyles)


  const rootVariants = {
    [mergedStyles.highlightOnHover]: highlightOnHover,
  }

  // TODO: add neutral.
  const colorVariants = {
    [mergedStyles.secondary]: secondaryColor,
    [mergedStyles.primary]: !secondaryColor,
  }

  const noSizeVariants = !sm && !md && !lg
  const sizeVariants = {
    [mergedStyles.sm]: sm,
    [mergedStyles.md]: md || noSizeVariants, // Default to md if no size specified
    [mergedStyles.lg]: lg
  }

  const iconVariants = {
    [mergedStyles.brightenOnHover]: brightenOnHover,
    [mergedStyles.muted]: muted,
    [mergedStyles.bright]: bright
  }

  const cn = {
    root: cns(mergedStyles.root, rootVariants, className),
    icon: cns(iconVariants, colorVariants, sizeVariants)
  }

  // Should iconText live here?
  return (
    <div {...{ onClick }} className={cn.root}>
      {solid ?
        <SolidIcon className={cn.icon} onClick={onClick}/> :
        <OutlineIcon className={cn.icon} onClick={onClick}/>
      }
    </div>
  )
}

export default BaseIcon
