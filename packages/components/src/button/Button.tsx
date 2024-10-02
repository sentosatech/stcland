import React from 'react'
import { cns, appliedStyles } from '@stcland/utils'
import type { ButtonStyles } from 'src/styles'
import '../index.css'

export const noop = () => {}

//*****************************************************************************
// Interface
//*****************************************************************************

// Should only be used by Button components that wrap this component
// For example SubmitButton, ResetButton. It is recommended that these
// are not ever set directly by a client view
export type ParentButtonPropsShape = {
  type?: 'submit' | 'reset';
  form?: string;
};

export interface Props {
  text?: string;
  onClick?: () => void;
  customStyles?: Partial<ButtonStyles>
  icon?: React.ComponentType<{ className?: string }>
  sm?: boolean
  md?: boolean
  lg?: boolean
  outlined?: boolean
  brightenOnHover?: boolean
  primary?: boolean
  neutral?: boolean
  secondary?: boolean
  fullWidth?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  parentButtonProps?: ParentButtonPropsShape;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************

const Button = function ({
  text = 'No Text',
  onClick = noop,
  icon,
  primary = true,
  secondary,
  neutral,
  fullWidth = false,
  disabled = false,
  rounded = true,
  brightenOnHover = false,
  sm,
  md = true,
  lg,
  outlined = false,
  parentButtonProps = {},
  customStyles = {},
  className,
}: Props) {

  const { type, form } = parentButtonProps || {}

  const defaultStyles : ButtonStyles = {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      outlined: 'border border-primary-dark text-primary-main hover:border-primary-dark hover:bg-primary-range-200',
      solid: 'bg-primary-dark hover:bg-primary-range-900 text-gray-50'
    },
    secondary:{
      outlined: 'border border-secondary-dark text-secondary-dark hover:border-secondary-main hover:bg-secondary-range-200',
      solid: 'bg-secondary-dark hover:bg-secondary-range-900 text-gray-50',
    },
    neutral: {
      outlined: 'border border-gray-700 text-gray-500 hover:border-gray-600 hover:bg-gray-200',
      solid: 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    brightenOnHover: 'hover:brightness-300',
    icon: 'w-3.5 h-3.5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full'
  }

  if (secondary) {
    primary = false
    neutral = false
  } else if (neutral) {
    primary = false
    secondary = false
  }


  // Merge custom styles with default styles.
  const mergedStyles = appliedStyles(defaultStyles, customStyles)

  // Define styles based on props.
  const sizeVariants = cns(
    sm ? mergedStyles.sm : '',
    md ? mergedStyles.md : '',
    lg ? mergedStyles.lg : '',
    fullWidth ? mergedStyles.fullWidth : ''
  )

  const shapeVariant = rounded ? mergedStyles.rounded : 'rounded-sm'

  const brightnessOnHover = brightenOnHover ? 'hover:brightness-300' : ''

  const disabledStyle = disabled ? 'border-none bg-gray-300 text-gray-400 hover:bg-gray-350' : ''

  const solidVariants = neutral ? mergedStyles.neutral.solid : secondary ?  mergedStyles.secondary.solid : primary ? mergedStyles.primary.solid : mergedStyles.primary.solid
  const outlinedVariants = neutral ? mergedStyles.neutral.outlined : secondary ?  mergedStyles.secondary.outlined : primary ? mergedStyles.primary.outlined : mergedStyles.primary.outlined


  const colorVariants = outlined ? outlinedVariants : solidVariants

  const cn = {
    root: cns(
      mergedStyles.root,
      sizeVariants,
      shapeVariant,
      brightnessOnHover,
      colorVariants,
      disabledStyle,
      className
    ),
    button: mergedStyles.button,
    icon: mergedStyles.icon as any
  }

  return (
    <div className={cn.root}>
      {icon && React.createElement(icon,{ className: cn.icon })}
      <button
        {...{ type: type || 'button', form, onClick, disabled }}
        className={cn.button}
      >
        {text}
      </button>
    </div>
  )
}

export default Button
