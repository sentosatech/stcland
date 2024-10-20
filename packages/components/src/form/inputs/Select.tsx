import { isEmpty, isNil } from 'ramda'
import { Controller } from 'react-hook-form'
import ReactTailwindSelect from 'react-tailwindcss-select'
import { cns } from '@stcland/utils'
import FormLabel from '../FormLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
type Option = {
  value: string;
  label: string;
};

interface Props {
  name: string;
  label: string;
  options: Option[];
  onSelectionChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  classNames?: {
    menuButton?: string;
    label?: string;
  };
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
  onSelectionChange,
  className = '',
  classNames = {},
  disabled = false,
}: Props) => {
  if (isNil(options) || isEmpty(options)) return null

  const cn = {
    root: cns('mb-3', className),
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

    const listItem = ({ isSelected }: { isSelected?: boolean }) => {
      const selectedStyle = isSelected
        ? 'text-zinc-900 bg-app-yellow hover:opacity-80'
        : 'text-zinc-400 bg-zinc-700 hover:bg-zinc-600'
      const baseStyle =
        'block transition duration-200 px-2 py-1.5 cursor-pointer select-none truncate rounded text-xs'
      return cns(baseStyle, selectedStyle)
    }

    return (
      <ReactTailwindSelect
        options={options}
        value={value}
        onChange={handleChange}
        isDisabled={disabled}
        primaryColor="text-primary-main"
        classNames={{
          menuButton: () =>
            cns(
              'flex h-7 w-full items-center rounded-md border border-zinc-600 bg-zinc-925 p-1 text-sm text-zinc-400',
              classNames.menuButton || '',
            ),
          menu: 'absolute z-10 min-w-full bg-zinc-700 rounded py-1 mt-1.5 text-base',
          listItem,
        }}
      />
    )
  }

  return (
    <div className={cn.root}>
      <FormLabel className={classNames.label || ''} labelText={label} />
      <Controller
        name={name}
        defaultValue={options[0]?.value || ''}
        render={renderForm}
      />
    </div>
  )
}

export default SelectMenuInput
