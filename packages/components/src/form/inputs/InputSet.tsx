import { appliedStyles } from '@stcland/utils'
import { CheckBoxStyles } from 'src/styles/componentTypes'
import FormInput, {
  FieldType,
  FormInputProps,
  pickFormProps,
} from '../FormInput'

type EmailProps = FormInputProps;
type NumberProps = FormInputProps;
type PasswordProps = FormInputProps;
type TextInputProps = FormInputProps;
type TextAreaProps = FormInputProps & { rows?: number };
type TimeInputProps = FormInputProps;
type DateInputProps = FormInputProps;
type RadioButtonProps = FormInputProps & {
  onChange?: (event: React.MouseEvent<HTMLInputElement>) => void;
};
type CheckBoxProps = FormInputProps & {
  customStyles?: Partial<CheckBoxStyles>;
};

type InputSetProps = FormInputProps & {
  type:
    | FieldType.EMAIL
    | FieldType.NUMBER
    | FieldType.TEXT
    | FieldType.PASSWORD
    | FieldType.TEXTAREA
    | FieldType.TIME
    | FieldType.RADIO
    | FieldType.DATE
    | FieldType.CHECKBOX;
};

const InputSet = function ({ ...props }: InputSetProps) {
  const formInputProps: InputSetProps = {
    ...pickFormProps<FormInputProps>(props),
    type: props.type,
  }
  return <FormInput {...formInputProps} />
}

const Email = ({ ...props }: EmailProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.EMAIL} />
)

const NumberInput = ({ ...props }: NumberProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.NUMBER} />
)

const Password = ({ ...props }: PasswordProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.PASSWORD} />
)

const Text = ({
  label = '',
  placeholder = '',
  valueAsNumber = false,
  required = false,
  disabled = false,
  hidden = false,
  onFocus = () => {},
  ...rest
}: TextInputProps) => (
  <InputSet
    label={label}
    placeholder={placeholder}
    valueAsNumber={valueAsNumber}
    required={required}
    disabled={disabled}
    hidden={hidden}
    onFocus={onFocus}
    {...pickFormProps(rest)}
    type={FieldType.TEXT}
  />
)

const TextArea = ({ ...props }: TextAreaProps) => (
  <InputSet
    {...pickFormProps(props)}
    type={FieldType.TEXTAREA}
    textAreaProps={{ rows: props.rows || 4 }}
  />
)

const TimeInput = ({ ...props }: TimeInputProps) => (
  <InputSet
    {...pickFormProps(props)}
    type={FieldType.TIME}
    defaultValue={props.defaultValue}
  ></InputSet>
)

const DateInput = ({ ...props }: DateInputProps) => (
  <InputSet
    defaultValue={props.defaultValue}
    {...pickFormProps(props)}
    type={FieldType.DATE}
  />
)

const RadioButton = ({ id, onChange, ...props }: RadioButtonProps) => {
  return (
    <InputSet
      {...pickFormProps(props)}
      type={FieldType.RADIO}
      onChange={onChange}
    />
  )
}

const CheckBox = ({ ...props }: CheckBoxProps) => {
  const cn: CheckBoxStyles = appliedStyles(
    {
      root: 'flex-row-reverse justify-end items-center py-4',
      inputRoot: 'accent-sky-500 rounded-sm h-100',
      label: 'pt-0 mb-0',
    },
    props.customStyles
  )

  return (
    <InputSet
      {...pickFormProps(props)}
      customStyles={cn}
      type={FieldType.CHECKBOX}
    />
  )
}

export {
  CheckBox,
  DateInput,
  Email,
  InputSet,
  NumberInput,
  Password,
  RadioButton,
  Text,
  TextArea,
  TimeInput,
}

export type {
  CheckBoxProps,
  DateInputProps,
  EmailProps,
  NumberProps,
  PasswordProps,
  RadioButtonProps,
  TextAreaProps,
  TextInputProps,
  TimeInputProps,
}
