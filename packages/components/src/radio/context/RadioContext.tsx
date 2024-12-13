import React from 'react'
import type { RadioGroupStyles } from 'src/styles'

export interface RadioContextValue {
  selectedValue: string | null
  onChange: (value: string) => void
  customStyles?: Partial<RadioGroupStyles>
}

export const RadioContext = React.createContext<RadioContextValue | null>(null)

export const useRadioContext = (): RadioContextValue => {
  const context = React.useContext(RadioContext)
  if (!context) {
    throw new Error('useRadioContext must be used within a RadioGroup')
  }
  return context
}