import { isEmpty, isNil } from 'ramda'
import { Controller } from 'react-hook-form'
import ReactTailwindSelect from 'react-tailwindcss-select'
import { appliedStyles, cns } from '@stcland/utils'
import FormLabel from '../FormLabel'
import { SelectInputStyles } from 'src/styles'

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
  customStyles?: Partial<SelectInputStyles>;
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

  const cn = appliedStyles(
    {
      root: 'flex flex-col gap-2',
      label: '',
      menuButton:
        'flex px-4 py-1 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full items-center [&>*:first-child]:grow',
      menu: 'absolute z-10 min-w-full bg-zinc-700 rounded py-1 mt-1.5 text-base',
      listItem: {
        base: 'block transition duration-200 px-2 cursor-pointer select-none truncate rounded text-lg text-zinc-400 bg-zinc-700 hover:bg-zinc-600 py-2',
        selected: 'text-white hover:opacity-80',
      },
    },
    customStyles
  )

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

    const listItem = ({ isSelected }: { isSelected?: boolean }) => {
      const { base, selected } = cn.listItem
      return cns(base, isSelected && selected)
    }

    return (
      <ReactTailwindSelect
        options={options}
        value={value}
        onChange={handleChange}
        isDisabled={disabled}
        primaryColor="text-primary-main"
        classNames={{
          menuButton: () => cn.menuButton,
          menu: cn.menu,
          listItem,
        }}
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
