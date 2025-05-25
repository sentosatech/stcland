import { isEmpty, isNil } from 'ramda'
import { Controller } from 'react-hook-form'
import { appliedStyles, cns } from '@stcland/utils'
import FormLabel from '../FormLabel'
import { SelectStyles } from 'src/styles'
import  { Select }  from '../../shared/Select'

//*****************************************************************************
// Interface
//*****************************************************************************
type Option = {
  value: string;
  label: string;
};

export interface Props {
  name: string;
  label: string;
  options: Option[];
  onSelectionChange?: (value: string) => void;
  disabled?: boolean;
  customStyles?: Partial<SelectStyles>;
  required?: boolean;
  hidden?: boolean;
}

//*****************************************************************************
// Components
//*****************************************************************************
interface FormProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}

const SelectMenuInput = ({
  name,
  label,
  options,
  disabled = false,
  customStyles,
  required,
  onSelectionChange,
  hidden = false,
}: Props) => {
  if (isNil(options) || isEmpty(options) || hidden) return null

  const selectStyles = {
    root: 'relative w-64',
    label: 'block mb-2 text-sm font-medium text-gray-700',
    button: 'flex flex-row items-center justify-between w-full px-4 py-2 text-left bg-neutral-surface-2 border border-stroke-default rounded focus:border-neutral-text-icon-body cursor-pointer',
    buttonSelected: 'border-primary-surface-dark',
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
    root: mergedStyles.root,
    label: mergedStyles.label,
    menu: mergedStyles.menu,
    button: cns(mergedStyles.button, disabled && mergedStyles.disabled),
    optionContainer: mergedStyles.optionContainer,
    listItem: mergedStyles.listItem,
    selectedDefaultIcon: mergedStyles.selectedDefaultIcon
  }

  function renderForm(props: FormProps) {
    const field = props.field
    const value = options.find((option) => option.value === field.value)!

    const handleChange = (option: Option | Option[] | null) => {
      const value =
        option && 'value' in option
          ? option.value
          : option?.map((v) => v).join('')
      if (value) {
        onSelectionChange?.(value)
        field.onChange(value)
      }
    }


    return (
      <Select
        options={options}
        selectedOption={value}
        onHandleChange={handleChange}
        placeholder='Select an option'
        disabled={disabled}
        styles={cn}
      />
    )
  }

  return (
    <div className={cn.root}>
      <FormLabel
        customStyles={{ root: cn.label }}
        labelText={label}
        required={required}
      />
      <Controller
        name={name}
        defaultValue={options[0]?.value || ''}
        render={renderForm}
      />
    </div>
  )
}

export default SelectMenuInput
