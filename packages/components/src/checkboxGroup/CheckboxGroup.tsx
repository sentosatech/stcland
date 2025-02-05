import { cns, appliedStyles } from '@stcland/utils'
import { CheckboxGroupStyles } from 'src/styles'
import { Checkbox } from '../checkbox/'

interface CheckboxOptionBase {
  label: string;
    // Label displayed alongside the checkbox
  value: string;
   // Unique identifier for the checkbox
  checked: boolean;
   // Determines if the checkbox is selected
  disabled?: boolean;
   // Optionally disable specific checkboxes
  indeterminate?: boolean
  type?: 'primary' | 'secondary' | 'tertiary'
  size: 'sm' | 'md' | 'lg'
}

export type CheckboxOption =
    | (CheckboxOptionBase & { icon?: never; checkedIcon?: never; indeterminateIcon?: never })
    | (CheckboxOptionBase & { icon: React.ReactNode; checkedIcon: React.ReactNode; indeterminateIcon?: React.ReactNode }) // Customized icons.


export interface CheckboxGroupProps {
  options: CheckboxOption[];
   // Array of checkboxes
  onChange: (updatedOptions: CheckboxOption[]) => void;
   // Callback for parent to handle state changes
  orientation?: 'vertical' | 'horizontal';
   // Layout of checkboxes
  className?: string;
   // Additional styling for the group
  customStyles?: Partial<CheckboxGroupStyles>;
}


const CheckboxGroup = ({
  options,
  onChange,
  orientation = 'vertical',
  className,
  customStyles,
}: CheckboxGroupProps) => {
  // Handle checkbox change
  const handleCheckboxChange = (index: number) => {
    const updatedOptions = [...options]
    updatedOptions[index].checked = !updatedOptions[index].checked
    onChange(updatedOptions)
  }

  const checkboxGroupStyles = {
    root: 'flex',
    vertical: 'flex-col gap-2',
    horizontal: 'flex-row gap-4',
    checkbox: {
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
      labelPrimary: 'text-zinc-900',
      labelSecondary: 'text-yellow-200',
      labelNeutral: 'text-gray-700',
      labelCustomIcon: 'text-gray-925'
    }
  }

  const mergedStyles = appliedStyles(checkboxGroupStyles, customStyles)

  const cn = {
    root: cns(mergedStyles.root, className, orientation === 'vertical' ? mergedStyles.vertical : mergedStyles.horizontal),
    checkbox: mergedStyles?.checkbox
  }

  return (
    <div
      className={cn.root}
    >
      {options.map((option, index) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={option.checked}
          checkedIcon={option.checkedIcon}
          indeterminate={option.indeterminate}
          icon={option.icon}
          indeterminateIcon={option.indeterminateIcon}
          onChange={() => handleCheckboxChange(index)}
          disabled={option.disabled}
          type={option.type}
          size={option.size}
          customStyles={cn.checkbox}
        />
      ))}
    </div>
  )
}

export default CheckboxGroup
