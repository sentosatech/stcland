import { appliedStyles, cns } from '@stcland/utils'
import { path } from 'ramda'
import { useFormContext } from 'react-hook-form'
import { RadioButtonGroupStyles } from 'src/styles/componentTypes'
import { nullFormContext } from '../Form'
import { Icon } from '../../icon'
import FormLabel from '../FormLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
type RadioButtonShape = {
  label: string;
  value: string;
};

export interface RadioButtonGroupProps {
  name: string;
  label?: string;
  direction?: 'vertical' | 'horizontal';
  defaultChecked?: string;
  radioButtons: RadioButtonShape[];
  readOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  customStyles?: Partial<RadioButtonGroupStyles>;
}

//*****************************************************************************
// Component
//*****************************************************************************

const toId = function (name: string, radioButtonValue: string): string {
  return name + '.' + radioButtonValue
}

function RadioButtonGroup(props: RadioButtonGroupProps) {
  const {
    name,
    label,
    radioButtons,
    disabled = false,
    hidden = false,
    direction = 'horizontal',
    defaultChecked = '',
    required = false,
    readOnly = false,
    customStyles,
  } = props

  const { register, formState, clearErrors, setFocus } =
    useFormContext() || nullFormContext
  const { errors } = formState || {}

  const errorTextPath = [...name.split('.'), 'message']
  const errorText: React.ReactNode = path(errorTextPath, errors)

  const registerRequired = {
    value: required,
    message: ' is required',
  }
  const flexDir = direction === 'horizontal' ? 'flex-row' : 'flex-col'

  const cn: RadioButtonGroupStyles = appliedStyles(
    {
      root: 'mb-2 flex gap-2 flex-col',
      buttonContainer: 'flex gap-2',
      label: 'text-neutral-text-icon-body',
      radioContainer: 'flex gap-2',
      error: 'text-states-error-default italic text-sm',
      radioButton: cns(
        'accent-primary-surface-default h-4 w-4 rounded-full',
        'focus:ring-offset-2 focus:ring-2 focus:ring-primary-surface-default',
        direction === 'horizontal' && 'flex-3'
      ),
      errorContainer: 'flex flex-row items-center pl-0',
      errorInput: 'border-2 border-states-error-dark',
      icon: {
        icon: 'text-states-error-dark',
        root: 'p-0 pr-2'
      }
    },
    customStyles
  )

  return (
    <div className={cns(cn.root, hidden && 'hidden')}>
      <FormLabel
        labelText={label}
        required={required}
        customStyles={{ root: cn.label }}
        htmlFor={name}
      />
      <div className={cns(cn.buttonContainer, flexDir)}>
        {radioButtons.map(({ label: inputLabel, value }) => (
          <div key={value} className={cn.radioContainer}>
            <input
              className={cn.radioButton}
              id={toId(name, value)}
              defaultChecked={value === defaultChecked}
              type="radio"
              readOnly={readOnly}
              {...{ name, value, disabled }}
              {...register(name, { required: registerRequired })}
            />
            <FormLabel
              key={value}
              customStyles={{ root: cn.label }}
              htmlFor={toId(name, value)}
              labelText={inputLabel}
            />
          </div>
        ))}
      </div>
      {errorText && (
        <div className={cn.errorContainer}>
          <Icon iconName='ExclamationCircleIcon' customStyles={{ icon: cn.icon.icon, root: cn.icon.root }}/>
          <div
            className={cn.error}
            onClick={() => {
              clearErrors(name)
              setFocus(name)
            }}
          >
            {name} {errorText}
          </div>
        </div>
      )}
    </div>
  )
}

export default RadioButtonGroup
