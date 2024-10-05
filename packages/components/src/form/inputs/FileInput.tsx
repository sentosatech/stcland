import FormInput, {
  FormInputProps,
  pickFormProps,
  FieldType,
} from '../FormInput'

type Props = FormInputProps;

const FileInput = ({
  name = '',
  label = '',
  placeholder = '',
  valueAsNumber = false,
  required = false,
  disabled = false,
  hidden = false,
  onFocus = () => {},
  ...rest
}: Props) => {
  const formProps = pickFormProps<Props>({
    ...rest,
    name,
    label,
    placeholder,
    valueAsNumber,
    required,
    disabled,
    hidden,
    onFocus,
  })
  const formInputProps = {
    ...formProps,
    name: name || formProps.name,
    type: FieldType.FILE,
  }

  return <FormInput {...formInputProps} />
}

export default FileInput
