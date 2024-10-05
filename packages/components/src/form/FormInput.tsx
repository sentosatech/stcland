import { path, pick } from 'ramda'
import { isNotNil } from 'ramda-adjunct'
import { useLayoutEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { appliedStyles, cns } from '@stcland/utils'

import { FormInputStyles } from 'src/styles/componentTypes'
import { nullFormContext } from './Form'
import Label from './FormLabel'

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

  const inputStyles: FormInputStyles = appliedStyles(
    {
      root: 'flex flex-col w-100 gap-2',
      label: 'text-sm pt-2',
      inputRoot: cns(
        type !== FieldType.TEXTAREA && 'h-14',
        'px-4 py-4 border-gray-600 border-solid rounded-lg bg-neutral-700 text-lg border text-white w-full dark:[color-scheme:dark]',
        'disabled:text-zinc-400'
      ),
      inputContainer: 'relative',
      error: 'text-red-300 italic text-sm',
      info: '',
    },
    customStyles
  )

  const inputProps = {
    type,
    placeholder: !errorText ? placeholder : '',
    className: inputStyles.inputRoot,
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
    <div className={inputStyles.root}>
      {label && (
        <Label
          customStyles={{ root: inputStyles.label }}
          {...{ labelText: label, required }}
        />
      )}
      <div className={inputStyles.inputContainer}>
        {type === FieldType.TEXTAREA ? (
          <textarea {...inputProps} className={inputStyles.inputRoot} />
        ) : (
          <input
            defaultValue={defaultValue}
            {...inputProps}
            type={String(inputProps.type)}
            className={inputStyles.inputRoot}
          />
        )}
      </div>
      {errorText && !value && (
        <div
          className={inputStyles.error}
          onClick={() => {
            clearErrors(name)
            setFocus(name)
          }}
        >
          {name} {errorText}
        </div>
      )}
    </div>
  )

  return FormInputComponent
}

export default FormInput
