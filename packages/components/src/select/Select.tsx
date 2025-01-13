import React from 'react'
import { appliedStyles, cns } from '@stcland/utils'
import { SelectStyles } from 'src/styles'
import  { Select as SelectComponent }  from '../shared/Select'

//*****************************************************************************
// Interface
//*****************************************************************************
type Option = {
  value: string
  label: string
  disabled?: boolean
  isSelected?: boolean
}
export interface SelectOption extends Option {
  icon?: React.ReactNode
  selectedIcon?: React.ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  selected: string
  placeholder?: string
  onChange?: (value: string) => void
  label?: string
  customStyles?: Partial<SelectStyles>
  className?: string
  disabled?: boolean
}

//*****************************************************************************
// Components
//*****************************************************************************

const Select: React.FC<SelectProps> = ({
  options,
  selected,
  onChange,
  label,
  disabled = false,
  customStyles,
  className
}) => {

  const selectStyles = {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-gray-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-neutral-surface-2 border border-stroke-default rounded focus:border-primary-surface-dark cursor-pointer',
    menu: 'absolute z-10 w-full bg-neutral-surface-1 border border-gray-300 text-neutral-text-icon-body rounded shadow-lg max-h-60 overflow-auto',
    disabled: 'text-neutral-text-icon-disabled',
    optionContainer: {
      default: 'flex items-center hover:bg-neutral-surface-2 justify-between p-2 cursor-pointer',
      selected: 'bg-primary-surface-subtle'
    },
    listItem: {
      base: '',
      selected: 'ml-0',
    },
    selectedDefaultIcon: 'h-5 w-5 ml-2 mr-3 text-primary-surface-dark'
  }

  const mergedStyles = appliedStyles<SelectStyles>(selectStyles, customStyles)

  const cn = {
    root: cns(mergedStyles.root, className),
    label: mergedStyles.label,
    menu: cns(mergedStyles.menu, disabled && mergedStyles.disabled),
    button: mergedStyles.button,
    optionContainer: mergedStyles.optionContainer,
    listItem: mergedStyles.listItem,
    selectedDefaultIcon: mergedStyles.selectedDefaultIcon
  }

  const selectedOption = options.find(option => option.value === selected) || null

  const handleSelectChange = (selectedOption: SelectOption) => {
    onChange?.(selectedOption.value)
  }

  return (
    <SelectComponent
      options={options}
      placeholder='Select an option'
      selectedOption={selectedOption}
      onHandleChange={handleSelectChange}
      label={label}
      disabled={disabled}
      styles={cn}
    />
  )
}

export default Select
