import type { IconStyles } from 'src/styles/componentTypes'
import type { IconProps } from '.'
import { cns, appliedStyles } from '@stcland/utils'
import * as React from 'react'
import * as outlineIcons from '@heroicons/react/24/outline'
import * as solidIcons from '@heroicons/react/24/solid'

export type IconName = keyof typeof outlineIcons | keyof typeof solidIcons

// Be safe, and check that icon exists using a Type Guard.
function isValidIcon(iconSet: Record<string, React.ComponentType<any>>, iconName: string)
: iconName is keyof typeof iconSet {
  return iconName in iconSet
}

//*****************************************************************************
// Components
//*****************************************************************************

export const Icon: React.FC<IconProps> = ({
  iconName,
  solid = false,
  sm,
  md,
  lg,
  secondaryColor = false,
  highlightOnHover = false,
  brightenOnHover = false,
  muted = false,
  bright = false,
  onClick = () => {},
  customStyles,
  className
}: IconProps) => {

  // Select the correct icon map based on solid prop.
  const iconsMap = solid ? solidIcons : outlineIcons

  // Get the Icon based on the `iconName`
  const IconComponent = iconsMap[iconName as keyof typeof iconsMap]

  if (!isValidIcon(iconsMap, iconName)) {
    console.error(`Icon ${iconName} not found in ${solid ? 'solid' : 'outline'} style.`)
    return <p>Icon not found</p>
  }

  const defaultStyles: IconStyles = {
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

  return (
    <div {...{ onClick }} className={cn.root}>
      {IconComponent ? (
        <IconComponent className={cn.icon} onClick={onClick} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Icon
