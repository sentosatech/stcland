import { cns, appliedStyles } from '@stcland/utils'
import { CheckboxStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

interface BaseCheckBoxProps {
    checked: boolean
    onChange: () => void
    indeterminate?: boolean // Controls wheter it is in a partial state, mostly used when there is a list of items, defaults to false.
    // Color variables
    primary?: boolean
    neutral?: boolean
    secondary?: boolean
    // Size variables
    sm?: boolean
    md?: boolean
    lg?: boolean
    disabled?: boolean

    tabIndex?: number // Finer control over focus management, defaults to 0
    className?: string
    customStyles?: Partial<CheckboxStyles>
}


export type CheckboxProps =
    | (BaseCheckBoxProps & { icon?: never; checkedIcon?: never; indeterminateIcon?: never })
    | (BaseCheckBoxProps & { icon: React.ReactNode; checkedIcon: React.ReactNode; indeterminateIcon?: React.ReactNode }) // Customized icons.


//*****************************************************************************
// Components
//*****************************************************************************

const Checkbox = ({
  checked,
  onChange,
  indeterminate = false,
  icon,
  checkedIcon,
  indeterminateIcon,
  disabled = false,
  primary,
  neutral,
  secondary,
  sm,
  md,
  lg,
  className,
  tabIndex = 0,
  customStyles
}: CheckboxProps) => {


  const defaultStyles: CheckboxStyles  = {
    root: 'cursor-pointer',
    rootWithoutCustomIcons: 'rounded-sm border-2 flex items-center justify-center border-gray-400',
    primary: 'bg-primary-main border-primary-main',
    secondary: 'bg-secondary-main border-secondary-main',
    neutral: 'bg-gray-600 border-gray-600',
    uncheckedPrimary: 'border-primary-main',
    uncheckedSecondary: 'border-secondary-main',
    uncheckedNeutral: 'border-gray-600',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    smChecked: 'text-xs',
    mdChecked: 'text-md',
    lgChecked: 'text-lg',
    disabled: 'bg-gray-300 border-gray-300 text-gray-400 hover:bg-gray-350',
    checked: 'text-white',
    indeterminate: 'absolute w-3/4 h-0.5',
  }

  const mergedStyles = appliedStyles<CheckboxStyles>(defaultStyles, customStyles)

  const noColorVariant = !secondary && !primary && !neutral

  const colorVariants = {
    [mergedStyles.secondary]: secondary,
    [mergedStyles.primary]: primary || noColorVariant,
    [mergedStyles.neutral]: neutral
  }

  const noSizeVariants = !sm && !md && !lg

  const sizeVariants = {
    [mergedStyles.sm]: sm,
    [mergedStyles.md]: md || noSizeVariants,
    [mergedStyles.lg]: lg
  }

  const checkedSizeVariants = {
    [mergedStyles.smChecked]: sm,
    [mergedStyles.mdChecked]: md || noSizeVariants,
    [mergedStyles.lgChecked]: lg
  }

  const uncheckedColorVariants = {
    [mergedStyles.uncheckedPrimary]: primary ||  noColorVariant,
    [mergedStyles.uncheckedSecondary]: secondary,
    [mergedStyles.uncheckedNeutral]: neutral
  }

  const checkedStyle = !icon && (checked ? colorVariants : uncheckedColorVariants)
  const disabledStyle = disabled && mergedStyles.disabled
  const indeterminateRoot = indeterminate && 'relative'

  const cn = {
    root: cns(mergedStyles.root, !icon && mergedStyles.rootWithoutCustomIcons, checkedStyle, !icon && sizeVariants, className, disabledStyle, indeterminateRoot),
    checked: cns(checked ? mergedStyles.checked : 'text-transparent', checkedSizeVariants, disabledStyle),
    indeterminate: cns(indeterminate ? colorVariants : '', mergedStyles.indeterminate)
  }

  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      tabIndex={tabIndex}
      onClick={!disabled ? onChange : undefined}
      className={cn.root}
    >
      {indeterminate ? (
        indeterminateIcon || <span className={cn.indeterminate}/>
      ) : checked ? (
        checkedIcon || <span className={cn.checked}>&#10003;</span>
      ) : (
        icon || <span className={cn.checked}>&#10003;</span>
      )}
    </span>
  )
}

export default Checkbox