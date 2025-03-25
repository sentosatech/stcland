import { path, pick } from 'ramda'
import { isNotNil } from 'ramda-adjunct'
import { useLayoutEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { appliedStyles, cns } from '@stcland/utils'

import { FormInputStyles } from 'src/styles/componentTypes'
import { nullFormContext } from './Form'
import Label from './FormLabel'
import { Icon } from '../icon'

//*****************************************************************************
// Interface
//*****************************************************************************

type TextAreaPropsShape = {
  rows: number;
};

export type FormInputProps = {
  name: string;
  value?: any;
  defaultValue?: any;
  id?: string;
  label?: string;
  placeholder?: string;
  valueAsNumber?: boolean;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  touched?: boolean;
  dirty?: boolean;
  onFocus?: () => void;
  textAreaProps?: TextAreaPropsShape;
  customStyles?: Partial<FormInputStyles>;
  onChange?: () => void;
};

const formInputProps = [
  'type',
  'name',
  'value',
  'label',
  'placeholder',
  'required',
  'disabled',
  'hidden',
  'onFocus',
  'customStyles',
  'touched',
  'dirty',
] as const

export function pickFormProps<T>(props: T): T {
  return pick(formInputProps, props)
}

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  CHECKBOX = 'checkbox',
  'DATETIME-LOCAL' = 'datetime-local',
  DATE = 'date',
  TIME = 'time',
  FILE = 'file',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
}

type Props = FormInputProps & {
  type: FieldType;
  customStyles?: Partial<FormInputStyles>;
};

//*****************************************************************************
// Components
//*****************************************************************************

const FormInput = ({
  textAreaProps,
  type,
  name,
  id,
  value,
  label = '',
  defaultValue,
  onFocus = () => {},
  valueAsNumber = false,
  disabled = false,
  hidden = false,
  placeholder = '',
  required = false,
  customStyles,
}: Props) => {
  const { register, setValue, clearErrors, formState, setFocus } =
    useFormContext() || nullFormContext
  const { errors } = formState || {}

  useLayoutEffect(() => {
    if (isNotNil(value)) {
      setValue(name, value)
    }
  }, [name, value, setValue])

  if (hidden) return null

  const errorTextPath = [...name.split('.'), 'message']
  const errorText: React.ReactNode = path(errorTextPath, errors)

  const registerRequired = {
    value: required,
    message: 'is required',
  }


  const defaultcn: FormInputStyles = {
    root: 'flex flex-col w-100 gap-2',
    label: 'text-neutral-text-icon-body text-sm pt-2',
    inputRoot: {
      default: 'text-base px-4 py-4 border-neutral-stroke-default border-2 rounded-lg bg-neutral-surface-2 text-neutral-text-icon-body border w-full',
      hover: 'hover:border-neutral-stroke-dark',
      pressed: 'active:text-neutral-text-icon-body',
      disabled: 'disabled:text-neutral-stroke-default disabled:bg-neutral-surface-disabled'
    },
    inputContainer: 'relative',
    errorContainer: 'flex flex-row items-center',
    error: 'text-states-error-default italic text-sm',
    errorInput: 'border-2 border-states-error-dark',
    info: '',
    icon: {
      icon:'text-states-error-dark' ,
      root: 'p-0 pr-2'
    }
  }

  const mergedStyles = appliedStyles<FormInputStyles>(defaultcn, customStyles)

  const cn = {
    root: cns(mergedStyles.root, type === FieldType.CHECKBOX && 'flex-col items-start'),
    label: mergedStyles.label,
    inputRoot: cns(
      type !== FieldType.TEXTAREA && 'h-14',
      mergedStyles.inputRoot.default,
      mergedStyles.inputRoot.hover,
      mergedStyles.inputRoot.pressed,
      mergedStyles.inputRoot.disabled,
      errorText && mergedStyles.errorInput
    ),
    inputContainer: cns(mergedStyles.inputContainer),
    errorContainer: mergedStyles.errorContainer,
    error: mergedStyles.error,
    info: mergedStyles.info,
    icon: mergedStyles.icon
  }

  const inputProps = {
    type,
    placeholder: !errorText ? placeholder : '',
    className: cn.inputRoot,
    id: id || name,
    disabled,
    onFocus,
    ...register(name, { required: registerRequired, valueAsNumber }),
    rows: 0,
  }

  if (type === FieldType.TEXTAREA) {
    inputProps.rows = textAreaProps?.rows || 3
  }

  const FormInputComponent = (
    <div className={cn.root}>
      <div className={type === FieldType.CHECKBOX ? 'flex flex-row-reverse gap-2' : ''}>
        {label && (
          <Label
            customStyles={{ root: cn.label }}
            {...{ labelText: label, required }}
          />
        )}

        <div className={cn.inputContainer}>
          {type === FieldType.TEXTAREA ? (
            <textarea {...inputProps} className={cn.inputRoot} />
          ) : (
            <input
              defaultValue={defaultValue}
              {...inputProps}
              type={String(inputProps.type)}
              className={cn.inputRoot}
            />
          )}
        </div>
      </div>
      {errorText && !value && (
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

  return FormInputComponent
}

export default FormInput
