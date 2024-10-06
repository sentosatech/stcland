import FormInput, {
  FormInputProps,
  pickFormProps,
  FieldType,
} from '../FormInput'
import FormInputLabel from '../FormLabel'

interface Props extends FormInputProps {
  formLabel: string;
}
const Checkbox = function ({ label, ...props }: Props) {
  const { formLabel, ...formProps } = pickFormProps<Props>(props)

  // Custom styling for checkbox
  const classNames = {
    input: 'h-4 w-8 accent-primary rounded-sm m-0 p-0',
  }

  const cn = {
    root: 'flex items-center mt-2 mb-4 gap-1 justify-center',
    label: 'text-neutral-400',
    input: 'ml-8',
  }

  const formInputProps: Props = {
    ...formProps,
    formLabel,
    classNames,
  }

  return (
    <div className={cn.root}>
      <FormInput {...formInputProps} type={FieldType.CHECKBOX} />
      <FormInputLabel className={cn.label} labelText={label} />
    </div>
  )
}

export default Checkbox
