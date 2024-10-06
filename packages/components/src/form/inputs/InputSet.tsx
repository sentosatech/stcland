import { cns } from '@stcland/utils'
import FormInput, {
  FieldType,
  FormInputProps,
  pickFormProps,
} from '../FormInput'

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

const Email = ({ ...props }: FormInputProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.EMAIL} />
)

const Number = ({ ...props }: FormInputProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.NUMBER} />
)

const Password = ({ ...props }: FormInputProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.PASSWORD} />
)

const Text = ({ ...props }: FormInputProps) => (
  <InputSet {...pickFormProps(props)} type={FieldType.TEXT} />
)

const TextArea = ({ ...props }: FormInputProps & { rows: number }) => (
  <InputSet
    {...pickFormProps(props)}
    type={FieldType.TEXTAREA}
    textAreaProps={{ rows: props.rows }}
  />
)

const TimeInput = ({ ...props }: FormInputProps) => (
  <InputSet
    {...pickFormProps(props)}
    type={FieldType.TIME}
    defaultValue={props.defaultValue}
    className={props.className || 'text-red'}
  />
)

const DateInput = ({ ...props }: FormInputProps) => (
  <InputSet
    defaultValue={props.defaultValue}
    {...pickFormProps(props)}
    className={cns('text-red w-full', props.className)}
    type={FieldType.DATE}
  />
)

const RadioButton = ({
  id,
  onChange,
  ...props
}: FormInputProps & {
  onChange?: (event: React.MouseEvent<HTMLInputElement>) => void;
}) => {
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
  Number,
  Password,
  Text,
  TextArea,
  TimeInput,
  DateInput,
  RadioButton,
}
