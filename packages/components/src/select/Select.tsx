import React from 'react'
import ReactTailwindSelect from 'react-tailwindcss-select'
import { appliedStyles, cns } from '@stcland/utils'
import { SelectStyles } from 'src/styles'
import { CheckIcon } from '@heroicons/react/24/solid'

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
  placeholder = 'Select an option',
  onChange,
  label,
  disabled = false,
  customStyles,
  className
}) => {

  const selectStyles = {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-gray-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-neutral-900 border border-gray-400 text-neutral-400 rounded focus:outline-none cursor-pointer',
    menu: 'absolute z-10 w-full bg-zinc-700 border border-gray-300 text-neutral-400 rounded shadow-lg max-h-60 overflow-auto',
    disabled: 'disabled:bg-gray-400',
    optionContainer: 'flex items-center p-2 cursor-pointer',
    listItem: {
      base: 'ml-10',
      selected: 'ml-0',
    },
    selectedDefaultIcon: 'h-5 w-5 ml-2 mr-3 text-yellow-500'
  }

  const mergedStyles = appliedStyles<SelectStyles>(selectStyles, customStyles)

  const cn = {
    root: cns(mergedStyles.root, className),
    label: mergedStyles.label,
    menu: mergedStyles.menu,
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
    <div className={cn.root}>
      {label && <label className={cn.label}>{label}</label>}

      <ReactTailwindSelect
        options={options}
        value={selectedOption}
        primaryColor=''
        onChange={handleSelectChange}
        isDisabled={disabled}
        placeholder={placeholder}
        classNames={{
          menuButton: () => cn.button!,
          menu: cn.menu,
        }}
        formatOptionLabel={({ label, isSelected, icon, selectedIcon }: SelectOption) => (
          <div className={cn.optionContainer}>
            <span>
              {isSelected ? (selectedIcon ? selectedIcon : <CheckIcon className={cn.selectedDefaultIcon}/>) : icon || null}
            </span>
            <span className={isSelected || icon ? cn.listItem.selected : cn.listItem.base}>{label}</span>
          </div>
        )}
      />
    </div>
  )
}

export default Select
