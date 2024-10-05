import { pick, path } from 'ramda'
import { isNotNil } from 'ramda-adjunct'
import { useLayoutEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { cns } from '@stcland/utils'

import { nullFormContext } from './Form'
import Label from './FormLabel'

//*****************************************************************************
// Interface
//*****************************************************************************
type ClassNamesShape = {
  input?: string;
  label?: string;
};
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
  classNames?: ClassNamesShape;
  className?: string;
};

export const formInputDefaultProps = {
  label: '',
  placeholder: '',
  valueAsNumber: false,
  required: false,
  readOnly: false,
  disabled: false,
  hidden: false,
  touched: false,
  dirty: false,
  onFocus: function () {},
  textAreaProps: {},
}

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
  'classNames',
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
  classNames?: ClassNamesShape;
  className?: string;
};

//*****************************************************************************
// Components
//*****************************************************************************

const FormInput = ({
  textAreaProps,
  className,
  classNames,
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

  const cn = {
    root: className || '',
    input: cns(
      'rounded-md border border-neutral-750 bg-zinc-925 text-sm text-zinc-400',
      'mb-4 p-1',
      type !== FieldType.TEXTAREA && 'h-8',
      classNames?.input || '',
    ),
    error:
      'absolute text-xs ml-2 text-rose-400 -top-2 items-center flex h-full',
  }

  const inputProps = {
    type,
    placeholder: !errorText ? placeholder : '',
    className: cn.input,
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
      {label && (
        <Label
          {...{ labelText: label, required, className: classNames?.label }}
        />
      )}
      <div className="relative">
        {type === FieldType.TEXTAREA ? (
          <textarea {...inputProps} className={cn.input} />
        ) : (
          <input
            defaultValue={defaultValue}
            {...inputProps}
            type={String(inputProps.type)}
            className={cn.input}
          />
        )}
        {errorText && !value ? (
          <div
            className={cn.error}
            onClick={() => {
              clearErrors(name)
              setFocus(name)
            }}
          >
            {name} {errorText}
          </div>
        ) : null}
      </div>
    </div>
  )

  return FormInputComponent
}

export default FormInput
