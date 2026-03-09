import { appliedStyles } from '@stcland/utils'
import { FormLabelStyles } from 'src/styles/componentTypes'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  labelText?: string; // If labelText, will still render errorText
  errorText?: string; // appended to label text in red if profvided
  required?: boolean; // required fields
  htmlFor?: string;
  customStyles?: Partial<FormLabelStyles>;
}

//*****************************************************************************
// Components
//*****************************************************************************
const FormLabel = function ({
  labelText,
  required,
  htmlFor,
  customStyles,
}: Props) {
  const cn: FormLabelStyles = appliedStyles(
    {
      root: 'mb-0.5 flex-row gap-3 text-xs text-white',
      required: 'ml-1 text-rose-400',
    },
    customStyles
  )
  return (
    <div className={cn.root}>
      <label htmlFor={htmlFor}>
        <span>{labelText}</span>
        {required && <span className={cn.required}>*</span>}
      </label>
    </div>
  )
}
export default FormLabel
