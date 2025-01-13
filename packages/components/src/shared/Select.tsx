import ReactTailwindSelect from 'react-tailwindcss-select'
import { CheckIcon } from '@heroicons/react/24/solid'
import { cns } from '@stcland/utils'

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
    selectedOption: Option | null
    placeholder: string
    onHandleChange: (value: Option) => void
    label?: string
    disabled?: boolean
    styles?: Record<string, any>
  }

  //*****************************************************************************
  // Components
  //*****************************************************************************

export const Select: React.FC<SelectProps> = ({
  options,
  selectedOption,
  placeholder,
  onHandleChange,
  label,
  disabled = false,
  styles = {}
}) => {

  return (
    <div className={styles.root}>
      {label && <label className={styles.label}>{label}</label>}

      <ReactTailwindSelect
        options={options}
        value={selectedOption}
        primaryColor=''
        onChange={onHandleChange}
        isDisabled={disabled}
        placeholder={placeholder}
        classNames={{
          menuButton: () => styles.button,
          menu: styles.menu,
        }}
        formatOptionLabel={({ label, isSelected, icon, selectedIcon }: SelectOption) => (
          <div className={cns(styles.optionContainer.default, isSelected && styles.optionContainer.selected)}>
            <span className={isSelected || icon ? styles.listItem.selected : styles.listItem.base}>{label}</span>
            <span>
              {isSelected ? (selectedIcon ? selectedIcon : <CheckIcon className={styles.selectedDefaultIcon}/>) : icon || null}
            </span>
          </div>
        )}
      />
    </div>
  )
}