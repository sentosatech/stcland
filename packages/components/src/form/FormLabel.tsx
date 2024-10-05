import { cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  labelText?: string; // If labelText, will still render errorText
  errorText?: string; // appended to label text in red if profvided
  className?: string; // className string applied to root of this component
  required?: boolean; // required fields
  requiredClass?: string; // class for required fields
}

//*****************************************************************************
// Components
//*****************************************************************************
const FormLabel = function ({
  labelText,
  className,
  required,
  requiredClass,
}: Props) {
  const cn = {
    root: cns('mb-0.5 flex-row gap-3 text-xs text-zinc-500', className || ''),
    required: cns('ml-1 text-rose-400', requiredClass || ''),
  }
  return (
    <div className={cn.root}>
      <label>
        <span>{labelText}</span>
        {required && <span className={cn.required}>*</span>}
      </label>
    </div>
  )
}
export default FormLabel
