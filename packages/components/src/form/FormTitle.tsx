import { cns } from '@stcland/utils'

//*****************************************************************************
// Interface
//*****************************************************************************
interface Props {
  title: string;
  className?: string;
}

//*****************************************************************************
// Components
//*****************************************************************************
const FormTitle = ({ title, className }: Props) => {
  const cn = {
    root: cns('mb-3 text-xl text-gray-400', className),
  }
  return <div className={cn.root}>{title}</div>
}
export default FormTitle
