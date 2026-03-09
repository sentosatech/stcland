import { cns, appliedStyles } from '@stcland/utils'
import { CheckboxStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

interface BaseCheckBoxProps {
    checked: boolean
    onChange: () => void
    label: string
     // The text displayed alongside the checkbox.
    indeterminate?: boolean
     // Controls wheter it is in a partial state, mostly used when there is a list of items, defaults to false.
    type?: 'primary' | 'secondary' | 'tertiary'
     //  Defaults to `primary`. Applies variant styling to the checkbox.
    size?: 'sm' | 'md' | 'lg'
     // Applies size variant. Defaults to `md`.
    disabled?: boolean
    tabIndex?: number
     // Finer control over focus management, defaults to 0
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
  label,
  indeterminate = false,
  icon,
  checkedIcon,
  indeterminateIcon,
  disabled = false,
  type = 'primary',
  size = 'md',
  className,
  tabIndex = 0,
  customStyles
}: CheckboxProps) => {


  const defaultStyles: CheckboxStyles  = {
    container: 'flex flex-row items-center gap-2',
    root: 'cursor-pointer',
    rootWithoutCustomIcons: 'rounded-sm border-2 flex items-center justify-center border-gray-400',
    primary: 'bg-primary-main border-primary-main',
    secondary: 'bg-secondary-main border-secondary-main',
    tertiary: 'bg-gray-600 border-gray-600',
    uncheckedPrimary: 'border-primary-main',
    uncheckedSecondary: 'border-secondary-main',
    uncheckedTertiary: 'border-gray-600',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    smChecked: 'text-xs',
    mdChecked: 'text-md',
    lgChecked: 'text-lg',
    disabled: 'bg-gray-300 border-gray-300 text-gray-400 hover:bg-gray-350 cursor-auto',
    indeterminatePrimary: 'absolute w-3/4 h-0.5 bg-primary-main',
    indeterminateSecondary: 'absolute w-3/4 h-0.5',
    indeterminateTertiary: 'absolute w-3/4 h-0.5',
    labelPrimary: 'text-primary-surface-default',
    labelSecondary: 'text-primary-surface-default',
    labelNeutral: 'text-gray-700',
    labelCustomIcon: 'text-gray-925'
  }

  const mergedStyles = appliedStyles<CheckboxStyles>(defaultStyles, customStyles)

  const primary = type === 'primary'
  const secondary = type === 'secondary'
  const tertiary = type === 'tertiary'
  const sm = size === 'sm'
  const md = size === 'md'
  const lg = size === 'lg'

  const colorVariants = {
    [mergedStyles.secondary]: secondary,
    [mergedStyles.primary]: primary,
    [mergedStyles.tertiary]: tertiary
  }

  const sizeVariants = {
    [mergedStyles.sm]: sm,
    [mergedStyles.md]: md,
    [mergedStyles.lg]:lg
  }

  const checkedSizeVariants = {
    [mergedStyles.smChecked]: sm,
    [mergedStyles.mdChecked]: md,
    [mergedStyles.lgChecked]: lg
  }

  const labelSizeVariants = {
    'text-md' : sm,
    'text-lg' : md,
    'text-xl' : lg
  }

  const uncheckedColorVariants = {
    [mergedStyles.uncheckedPrimary]: primary,
    [mergedStyles.uncheckedSecondary]: secondary,
    [mergedStyles.uncheckedTertiary]: tertiary
  }

  const indeterminateStyleVariants = {
    [mergedStyles.indeterminatePrimary]: primary,
    [mergedStyles.indeterminateSecondary]: secondary,
    [mergedStyles.indeterminateTertiary]: tertiary
  }

  const labelStyleVariants = {
    [mergedStyles.labelPrimary]: primary,
    [mergedStyles.labelSecondary]: secondary,
    [mergedStyles.labelNeutral]: tertiary,
    [mergedStyles.labelCustomIcon]: icon
  }

  const checkedStyle = !icon && (checked ? colorVariants : uncheckedColorVariants)
  const disabledStyle = disabled && mergedStyles.disabled
  const indeterminateRoot = indeterminate && 'relative'

  const cn = {
    container: mergedStyles.container,
    label: cns(labelStyleVariants, labelSizeVariants, disabled && 'text-gray-400'),
    root: cns(mergedStyles.root, !icon && mergedStyles.rootWithoutCustomIcons, checkedStyle, !icon && sizeVariants, className, disabledStyle, indeterminateRoot),
    checked: cns(!checked && 'text-transparent', checkedSizeVariants, disabledStyle),
    indeterminate: cns(indeterminate ? colorVariants : '', indeterminateStyleVariants)
  }

  return (
    <div className={cn.container}>
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
      <div className={cn.label}>
        {label}
      </div>
    </div>
  )
}

export default Checkbox