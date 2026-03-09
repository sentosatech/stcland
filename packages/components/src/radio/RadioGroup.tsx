import React, { useState } from 'react'
import { RadioContext, RadioContextValue } from './context/RadioContext'
import { appliedStyles, cns } from '@stcland/utils'
import type { RadioGroupStyles } from 'src/styles'

//*****************************************************************************
// Interface
//*****************************************************************************

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string
  direction?: 'horizontal' | 'vertical'
  customStyles?: Partial<RadioGroupStyles>
}

//*****************************************************************************
// Components
//*****************************************************************************

const RadioGroup = ({
  value: controlledValue,
  onChange,
  children,
  className,
  direction = 'vertical', // Default to vertical layout
  customStyles
}: RadioGroupProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(null)

  const isControlled = controlledValue !== undefined
  const selectedValue = isControlled ? controlledValue : uncontrolledValue

  const handleChange = (value: string) => {
    if (!isControlled) {
      setUncontrolledValue(value)
    }
    onChange?.(value)
  }

  const radioGroupStyles: RadioGroupStyles['radioGroup'] = {
    root: 'flex',
    vertical: 'flex-col space-y-2',
    horizontal: 'flex-row space-x-4'
  }

  const mergedStyles = appliedStyles<RadioGroupStyles['radioGroup']>(radioGroupStyles, customStyles?.radioGroup)

  const cn = {
    root: cns(mergedStyles.root, direction === 'vertical' ? mergedStyles.vertical : mergedStyles.horizontal, className)
  }

  const contextValue: RadioContextValue = {
    selectedValue,
    onChange: handleChange,
    customStyles
  }


  return (
    <RadioContext.Provider value={contextValue}>
      <div role='radiogroup' className={cn.root}>{children}</div>
    </RadioContext.Provider>
  )
}

export default RadioGroup