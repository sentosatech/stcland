import { cns } from '@stcland/utils'
import FormInput, {
  FieldType,
  FormInputProps,
  pickFormProps,
} from '../FormInput'

type EmailProps = FormInputProps;
type NumberProps = FormInputProps;
type PasswordProps = FormInputProps;
type TextInputProps = FormInputProps;
type TextAreaProps = FormInputProps & { rows: number };
type TimeInputProps = FormInputProps;
type DateInputProps = FormInputProps;
type RadioButtonProps = FormInputProps & {
  onChange?: (event: React.MouseEvent<HTMLInputElement>) => void;
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
    | FieldType.DATE;
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
    textAreaProps={{ rows: props.rows }}
  />
)

const TimeInput = ({ ...props }: TimeInputProps) => (
  <InputSet
    {...pickFormProps(props)}
    type={FieldType.TIME}
    defaultValue={props.defaultValue}
    className={props.className || 'text-red'}
  />
)

const DateInput = ({ ...props }: DateInputProps) => (
  <InputSet
    defaultValue={props.defaultValue}
    {...pickFormProps(props)}
    className={cns('text-red w-full', props.className)}
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

export {
  Email,
  InputSet,
  NumberInput,
  Password,
  Text,
  TextArea,
  TimeInput,
  DateInput,
  RadioButton,
}

export type {
  EmailProps,
  NumberProps,
  PasswordProps,
  TextInputProps,
  TextAreaProps,
  TimeInputProps,
  DateInputProps,
  RadioButtonProps,
}
