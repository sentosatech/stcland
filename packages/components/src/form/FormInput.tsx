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
export type FormInputStyles = Partial<{
  root: React.HTMLAttributes<HTMLDivElement>['className'];
  input: React.HTMLAttributes<HTMLInputElement>['className'];
  label: React.HTMLAttributes<HTMLDivElement>['className'];
  error: React.HTMLAttributes<HTMLDivElement>['className'];
  info: React.HTMLAttributes<HTMLDivElement>['className'];
}>;

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

  const inputStyles: FormInputStyles = {
    root: cns('flex flex-col w-100 gap-2', customStyles?.root),
    label: cns('text-sm', customStyles?.label),
    input: cns(
      type !== FieldType.TEXTAREA && 'h-14',
      'px-4 py-4 border-[#4B5563] border-solid rounded-lg bg-[#2A2C30] text-lg border text-white w-full',
      'placeholder:italic',
      'disabled:text-zinc-400',
      customStyles?.input
    ),
    error: cns('text-red-300 italic text-sm', customStyles?.error),
  }

  const inputProps = {
    type,
    placeholder: !errorText ? placeholder : '',
    className: inputStyles.input,
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
          className={inputStyles.label}
          {...{ labelText: label, required }}
        />
      )}
      <div className="relative">
        {type === FieldType.TEXTAREA ? (
          <textarea {...inputProps} className={inputStyles.input} />
        ) : (
          <input
            defaultValue={defaultValue}
            {...inputProps}
            type={String(inputProps.type)}
            className={inputStyles.input}
          />
        )}
      </div>
      {errorText && !value ? (
        <div
          className={inputStyles.error}
          onClick={() => {
            clearErrors(name)
            setFocus(name)
          }}
        >
          {name} {errorText}
        </div>
      ) : null}
    </div>
  )

  return FormInputComponent
}

export default FormInput
