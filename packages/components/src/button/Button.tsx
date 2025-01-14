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
    // Text label of the button. Defaults to 'No Text'.
  onClick?: () => void;
    // Fn to be called when the button is clicked. Defaults to a noop fn.
  type?: 'primary' | 'secondary' | 'tertiary'
    // The three button types. Defaults to primary.
  size?: 'sm' | 'md' | 'lg'
    // Size of the button. Defaults to md.
  leftIcon?: React.ComponentType<{ className?: string }>
    // Icon displayed before the text. Defaults to no icon.
  rightIcon?: React.ComponentType<{ className?: string }>
    // Icon displated after the text. Defaults to no icon.
  disabled?: boolean;
    // Disables the button when true. Defaults to false.
  highlightOnHover?: boolean
    // Changes background on hover when true. Defaults to false.
  fullWidth?: boolean;
    // True: the button will take the full container width. Defaults to false.
  rounded?: boolean;
    // Applies rounded corners to the button. Defaults to false.
  customStyles?: Partial<ButtonStyles>
    // Allow modifying custom styles for any button variant.
  parentButtonProps?: ParentButtonPropsShape;
    // Additional button properties when handling forms.
  className?: string
    // Tailwind Classes Applied to root container.
}


//*****************************************************************************
// Components
//*****************************************************************************

const Button = function ({
  text = 'No Text',
  onClick = noop,
  leftIcon,
  rightIcon,
  type = 'primary',
  fullWidth = false,
  disabled = false,
  rounded = false,
  highlightOnHover = false,
  size = 'md',
  parentButtonProps = {},
  customStyles = {},
  className,
}: Props) {

  const { type: formType, form } = parentButtonProps || {}

  const defaultStyles : ButtonStyles = {
    root: 'flex w-fit items-center gap-1 min-w-32 p-2.5 text-sm font-medium text-gray-800',
    primary: {
      default: 'bg-primary-surface-default text-white',
      hover: 'hover:bg-primary-surface-light hover:text-white',
      pressed: 'active:bg-primary-surface-dark active:text-white',
      disabled: 'disabled:bg-neutral-surface-disabled disabled:text-neutral-text-icon-disabled'
    },
    secondary:{
      default: 'border-2 border-primary-surface-default text-primary-surface-default',
      hover: 'border-2 hover:border-primary-surface-light hover:text-primary-text-icon-default',
      pressed: 'border-2 active:border-primary-surface-light active:bg-primary-surface-default active:text-primary-text-icon-default',
      disabled: 'border-2 disabled:border-neutral-text-icon-disabled bg-white disabled:text-neutral-text-icon-disabled'
    },
    tertiary: {
      default: 'text-primary-surface-default',
      hover: 'hover:text-primary-text-icon-default',
      pressed: 'active:text-primary-surface-dark',
      disabled: 'disabled:text-text-icon-disabled bg-transparent'
    },
    sm: 'p-2 text-1.5xs',
    md: 'p-3 text-sm',
    lg: 'p-3 text-md',
    fullWidth: 'w-full',
    rounded: 'rounded-md',
    highlightOnHover: 'hover:bg-gray-600',
    leftIcon: 'w-5 h-5 inline',
    rightIcon: 'w-5 h-5 inline',
    disabled: 'bg-gray-300 text-gray-400 hover:bg-gray-350',
    button: 'w-full'
  }

  const secondary = type === 'secondary'
  const primary = type === 'primary'
  const tertiary = type === 'tertiary'

  // Merge custom styles with default styles.
  const mergedStyles = appliedStyles<ButtonStyles>(defaultStyles, customStyles)

  // Define styles based on props.
  const sizeVariants = {
    [mergedStyles.sm] : size === 'sm',
    [mergedStyles.md] : size === 'md',
    [mergedStyles.lg] : size === 'lg',
    [mergedStyles.fullWidth] : fullWidth
  }

  const rootVariants = {
    [mergedStyles.highlightOnHover] : highlightOnHover,
    [mergedStyles.disabled] : disabled,
  }

  const shapeVariant = rounded ? mergedStyles.rounded : 'rounded-sm'

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

  const cn = {
    root: cns(
      mergedStyles.root,
      sizeVariants,
      shapeVariant,
      rootVariants,
      variantStyles,
      className
    ),
    button: mergedStyles.button,
    leftIcon: mergedStyles.leftIcon,
    rightIcon: mergedStyles.rightIcon
  }

  return (
    <div className={cn.root}>
      {leftIcon && React.createElement(leftIcon,{ className: cn.leftIcon })}
      <button
        {...{ type: formType || 'button', form, onClick, disabled }}
        className={cn.button}
      >
        {text}
      </button>
      {rightIcon && React.createElement(rightIcon,{ className: cn.rightIcon })}
    </div>
  )
}

export default Button
