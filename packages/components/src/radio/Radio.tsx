import type { RadioContextValue } from './context/RadioContext'
import { useRadioContext } from './context/RadioContext'
import { appliedStyles, cns } from '@stcland/utils'
import { useState } from 'react'
import type { RadioGroupStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface RadioProps {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
  // Allow to be used without a `RadioGroup` wrapper.
  onChange?: (value: string) => void
  selectedValue?: string
  customStyles?: Partial<RadioGroupStyles['isolatedRadio']>
}

//*****************************************************************************
// Components
//*****************************************************************************

const Radio = ({ value, label, disabled, className, onChange, selectedValue: externalSelectedValue, customStyles = {} }: RadioProps) => {
  let context : RadioContextValue | null
  try {
    context = useRadioContext()
  } catch {
    context = null // Fallback to standalone mode if no context is found
  }

  const { selectedValue: contextSelectedValue, onChange: contextOnChange, customStyles: contextCustomStyles } = context || {}
  const [localSelectedValue, setLocalSelectedValue] = useState<string | null>(null)

  const isControlled = externalSelectedValue !== undefined || contextSelectedValue !== undefined
  const selectedValue = externalSelectedValue ?? contextSelectedValue ?? localSelectedValue
  const isSelected = selectedValue === value

  const handleChange = () => {
    if (!disabled) {
      if (!isControlled) {
        setLocalSelectedValue(value)
      }
      onChange?.(value)
      contextOnChange?.(value)
    }
  }

  const radioStyles: RadioGroupStyles['radio'] = {
    root: 'flex items-center gap-2',
    inputRoot: 'sr-only',
    radio: 'w-4 h-4 rounded-full border-2 flex justify-center items-center border-gray-825 bg-none',
    radioDisabled: 'border-gray-400 bg-gray-100 cursor-not-allowed',
    selected: 'bg-primary-main',
    innerCircle: 'w-1.5 h-1.5 rounded-full bg-gray-825',
    text: 'text-sm text-gray-825',
    textDisabled: 'text-gray-400',
  }

  const mergedStyles = appliedStyles<RadioGroupStyles['radio']>(radioStyles, contextCustomStyles?.radio || customStyles)

  const cn = {
    root: cns(mergedStyles.root, `cursor-${disabled ? 'not-allowed' : 'pointer'}`, className),
    inputRoot: mergedStyles.inputRoot,
    radio: cns(mergedStyles.radio, isSelected && mergedStyles.selected, disabled && mergedStyles.radioDisabled),
    innerCircle: mergedStyles.innerCircle,
    text: cns(mergedStyles.text, disabled && mergedStyles.textDisabled),
  }

  return (
    <label className={cn.root}>
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={handleChange}
        disabled={disabled}
        className={cn.inputRoot}
      />
      <span className={cn.radio}>
        {isSelected && <span className={cn.innerCircle} />}
      </span>
      <span className={cn.text}>{label}</span>
    </label>
  )
}

export default Radio
