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
  size = 'md',
  type = 'primary',
  highlightOnHover = false,
  brightenOnHover = false,
  disabled = false,
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
    secondary:{
      default: 'text-primary-surface-dark',
      hover: 'hover:text-primary-text-icon-default',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    primary: {
      default: 'text-primary-surface-default',
      hover: 'hover:text-primary-surface-light',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-primary-surface-light',
      hover: 'hover:text-primary-surface-subtle',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    sm: 'h-4.5 w-4.5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    rounded: 'rounded-md',
    bright: 'brightness-125',
    highlightOnHover: 'hover:bg-gray-600',
    brightenOnHover: 'hover:brightness-125',
    muted: 'opacity-50',
    icon: '',
    button: ''
  }

  const mergedStyles = appliedStyles(defaultStyles, customStyles)

  const rootVariants = {
    [mergedStyles.highlightOnHover]: highlightOnHover,
  }

  const primary = type === 'primary'
  const secondary = type === 'secondary'
  const tertiary = type === 'tertiary'

  const typeVariants = primary
    ? mergedStyles.primary
    : secondary
      ? mergedStyles.secondary
      : tertiary
        ? mergedStyles.tertiary
        : mergedStyles.primary // Default

  const variantStyles =  {
    [typeVariants.default]: !disabled,
    [typeVariants.hover]: !disabled,
    [typeVariants.pressed]: !disabled,
    [typeVariants.disabled]: disabled,
  }

  const sizeVariants = {
    [mergedStyles.sm]: size === 'sm',
    [mergedStyles.md]: size === 'md',
    [mergedStyles.lg]: size === 'lg'
  }

  const iconVariants = {
    [mergedStyles.brightenOnHover]: brightenOnHover,
    [mergedStyles.muted]: muted,
    [mergedStyles.bright]: bright
  }

  const cn = {
    root: cns(mergedStyles.root, rootVariants, className),
    icon: cns(iconVariants, variantStyles, sizeVariants, 'group-disabled:text-gray-600')
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